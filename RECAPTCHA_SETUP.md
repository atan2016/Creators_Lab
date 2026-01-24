# Google reCAPTCHA Setup Instructions

## Overview
The contact form now uses Google reCAPTCHA v2 (checkbox) instead of the simple math captcha.

## Setup Steps

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **"+"** to create a new site
3. Fill in the form:
   - **Label**: CreatorsLab Contact Form
   - **reCAPTCHA type**: Select **"reCAPTCHA v2"** → **"I'm not a robot" Checkbox**
   - **Domains**: 
     - `localhost` (for development)
     - `creators-lab.org` (for production)
     - `www.creators-lab.org` (for production)
   - Accept the reCAPTCHA Terms of Service
4. Click **Submit**
5. Copy your **Site Key** and **Secret Key**

### 2. Add Environment Variables

Add to your `.env` file (or `.env.local`):

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Note**: Only the Site Key is needed in the frontend. The Secret Key is only needed if you want to verify on the server side (optional for Formspree).

### 3. For Vercel Deployment

Add the environment variable in Vercel:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` with your site key value

### 4. Test

1. Start your dev server: `npm run dev`
2. Navigate to the home page
3. Scroll to the Contact Us section
4. You should see a reCAPTCHA checkbox instead of the math question
5. Fill out the form and verify the reCAPTCHA works

## What Changed

- ✅ Removed math captcha (`8 + 4` question)
- ✅ Added Google reCAPTCHA v2 checkbox
- ✅ Updated form validation to check reCAPTCHA token
- ✅ reCAPTCHA resets after successful form submission

## Troubleshooting

**reCAPTCHA not showing:**
- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in your `.env` file
- Verify the domain is registered in your reCAPTCHA settings
- Check browser console for errors

**Form submission fails:**
- Ensure reCAPTCHA is completed before submitting
- Check that the reCAPTCHA token is being sent (check Network tab)
