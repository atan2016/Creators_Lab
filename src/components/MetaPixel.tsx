'use client'

import { useEffect } from 'react'

const META_PIXEL_ID = '753478844385343'
/** One PageView per tab session (survives client-side navigation; skips repeat on refresh in same tab). */
const SESSION_KEY = 'creators_lab_meta_pixel_session'

export function MetaPixel() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // sessionStorage blocked — still load pixel for this page load
    }

    if ((window as unknown as { fbq?: unknown }).fbq) return

    const inline = document.createElement('script')
    inline.text = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
    `.trim()
    document.head.appendChild(inline)
  }, [])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}
