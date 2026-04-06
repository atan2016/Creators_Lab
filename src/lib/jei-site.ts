/** Absolute site URL for emails and payment redirects (server-safe). */
export function getJeiSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://creators-lab.org')
  )
}

/** Opens our pay page, which creates a Stripe Checkout Session for the correct total. */
export function buildJeiRegistrationPayUrl(registrationId: string): string {
  return `${getJeiSiteBaseUrl()}/JEI/pay?registrationId=${encodeURIComponent(registrationId)}`
}
