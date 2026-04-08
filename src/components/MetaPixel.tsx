import Script from 'next/script'

const META_PIXEL_ID = '753478844385343'
const SESSION_KEY = 'creators_lab_meta_pixel_session'

/**
 * Official Meta Pixel snippet via next/script (afterInteractive).
 * Session gate: init + PageView only once per tab session (refresh in same tab skips).
 * To test with Meta Pixel Helper: use a fresh incognito window or clear site data for this origin.
 */
export function MetaPixel() {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  try {
    if (sessionStorage.getItem('${SESSION_KEY}')) return;
    sessionStorage.setItem('${SESSION_KEY}', '1');
  } catch (e) {}
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
})();
          `.trim(),
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
