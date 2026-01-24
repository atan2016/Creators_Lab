import Script from 'next/script'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  includeSearch?: boolean
}

export default function PageLayout({ children, title, description, includeSearch = true }: PageLayoutProps) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-85L4ZPPPP0"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-85L4ZPPPP0');
        `}
      </Script>
      {includeSearch && <link rel="stylesheet" href="/search.css" />}
      <Header />
      {children}
      <Footer />
      {includeSearch && (
        <>
          <Script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0" strategy="lazyOnload" />
          <Script src="/search.js" strategy="lazyOnload" />
        </>
      )}
    </>
  )
}
