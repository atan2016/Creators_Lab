import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getJeiSiteBaseUrl } from '@/lib/jei-site'
import type { JeiRegistrationStatus } from '@prisma/client'

const CHECKOUT_ALLOWED: JeiRegistrationStatus[] = ['PENDING_REVIEW', 'INVOICED']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const registrationId = typeof body.registrationId === 'string' ? body.registrationId.trim() : ''

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required.' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json({ error: 'Payment processing is not configured.' }, { status: 500 })
    }

    const registration = await prisma.jeiRegistration.findUnique({
      where: { id: registrationId },
    })

    if (!registration || registration.updatesOnly) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 })
    }

    if (registration.totalAmountCents <= 0) {
      return NextResponse.json({ error: 'Nothing to pay for this registration.' }, { status: 400 })
    }

    if (!CHECKOUT_ALLOWED.includes(registration.status)) {
      return NextResponse.json(
        { error: 'This registration is not open for online payment.' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    const baseUrl = getJeiSiteBaseUrl()
    const studentCount = Math.max(1, registration.studentCount)
    const unitPriceCents = Math.round(registration.totalAmountCents / studentCount)
    const quantityProductTotal = unitPriceCents * studentCount
    const usePerStudentLine =
      quantityProductTotal === registration.totalAmountCents && unitPriceCents > 0

    const descriptionParts = [
      `${studentCount} student${studentCount === 1 ? '' : 's'}`,
      registration.selectedProgramDates,
    ].filter(Boolean)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = usePerStudentLine
      ? [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `JEI — ${registration.selectedProgramName ?? 'Program'}`,
                description: descriptionParts.join(' · '),
              },
              unit_amount: unitPriceCents,
            },
            quantity: studentCount,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `JEI — ${registration.selectedProgramName ?? 'Program'}`,
                description: descriptionParts.join(' · ') || undefined,
              },
              unit_amount: registration.totalAmountCents,
            },
            quantity: 1,
          },
        ]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: registration.parentEmail,
      metadata: {
        type: 'jei_registration',
        jei_registration_id: registration.id,
      },
      success_url: `${baseUrl}/JEI/register?payment=success&registrationId=${encodeURIComponent(registration.id)}`,
      cancel_url: `${baseUrl}/JEI/register?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('JEI checkout session error:', error)
    return NextResponse.json({ error: 'Failed to start checkout.', message }, { status: 500 })
  }
}
