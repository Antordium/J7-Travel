import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>USCYBERCOM J7 Travel Dashboard</title>
        <meta name="description" content="USCYBERCOM J7 Travel Cost Dashboard for tracking and analyzing travel costs across staff sections" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="keywords" content="dashboard, travel, cost-tracking, analytics, military, uscybercom" />
        <meta name="author" content="USCYBERCOM J7" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content="USCYBERCOM J7 Travel Dashboard" />
        <meta property="og:description" content="Track and analyze travel costs across staff sections" />
        <meta property="og:type" content="website" />
        
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}