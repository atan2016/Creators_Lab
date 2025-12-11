/**
 * Vercel Serverless Function for Stripe Checkout Session Creation
 * Creates a Stripe Checkout session for donations
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Donation request received');
    const { amount, currency = 'usd' } = req.body;
    console.log('Amount:', amount, 'Currency:', currency);

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ error: 'Payment processing is not configured' });
    }

    // Dynamically import Stripe (ES module)
    const stripe = (await import('stripe')).default;
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Get the base URL for success/cancel redirects
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin || 'https://creators-lab.org');

    // Create Stripe Checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Donation to CreatorsLab',
              description: 'Support youth innovation and entrepreneurship programs',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/index.html?donation=success`,
      cancel_url: `${baseUrl}/index.html?donation=cancelled`,
      // Stripe Checkout automatically collects email and sends receipts
      // Receipt emails are enabled by default in Stripe settings
      metadata: {
        donation_type: 'general',
      },
    });

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
}

