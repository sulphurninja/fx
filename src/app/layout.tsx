import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FX Intelligence Platform | AI-Powered Foreign Exchange Analytics",
  description: "Professional FX intelligence platform with real-time exchange rates, AI-powered forecasting, and institutional-grade analytics for Nigerian Naira and major currency pairs.",
  keywords: [
    "foreign exchange",
    "FX rates",
    "Nigerian Naira",
    "USD/NGN",
    "currency exchange",
    "AI forecasting",
    "financial analytics",
    "real-time rates",
    "institutional trading",
    "market intelligence"
  ],
  authors: [{ name: "Backtick Labs" }],
  creator: "Backtick Labs",
  publisher: "Backtick Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fxintel.backtick.com",
    siteName: "FX Intelligence Platform",
    title: "FX Intelligence Platform | AI-Powered Foreign Exchange Analytics",
    description: "Professional FX intelligence platform with real-time exchange rates, AI-powered forecasting, and institutional-grade analytics for Nigerian Naira and major currency pairs.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FX Intelligence Platform Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BacktickLabs",
    creator: "@BacktickLabs",
    title: "FX Intelligence Platform | AI-Powered Foreign Exchange Analytics",
    description: "Professional FX intelligence platform with real-time exchange rates, AI-powered forecasting, and institutional-grade analytics.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.exchangerate-api.com" />
        <link rel="preconnect" href="https://api.fxratesapi.com" />
        <link rel="preconnect" href="https://www.alphavantage.co" />
        <link rel="dns-prefetch" href="//api.exchangerate-api.com" />
        <link rel="dns-prefetch" href="//api.fxratesapi.com" />
        <link rel="dns-prefetch" href="//www.alphavantage.co" />

        {/* Structured Data for Financial Services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "FX Intelligence Platform",
              "description": "AI-powered foreign exchange intelligence platform with real-time rates and forecasting",
              "provider": {
                "@type": "Organization",
                "name": "Backtick Labs",
                "url": "https://backtick.com"
              },
              "serviceType": "Foreign Exchange Analytics",
              "areaServed": {
                "@type": "Country",
                "name": "Nigeria"
              },
              "currenciesAccepted": ["USD", "NGN", "EUR", "GBP", "JPY"],
              "url": "https://fxintel.backtick.com",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "description": "Real-time FX data and AI forecasting",
                "category": "Financial Data Services"
              }
            }),
          }}
        />

        {/* Performance and Analytics */}
        <meta name="google-site-verification" content="demo-verification-code" />
        <meta name="msvalidate.01" content="demo-bing-verification" />

        {/* Security Headers via Meta Tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* PWA Configuration */}
        <meta name="application-name" content="FX Intelligence" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FX Intelligence" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Financial Data Specific Meta Tags */}
        <meta name="financial-data-provider" content="Multiple Sources" />
        <meta name="data-update-frequency" content="Real-time" />
        <meta name="supported-currencies" content="USD,NGN,EUR,GBP,JPY" />
        <meta name="ai-model-accuracy" content="94.2%" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            {children}
          </div>
        </div>

        {/* Service Worker Registration for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Analytics and Performance Monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                      // Track page load performance
                      console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
                    }
                  });
                });
                observer.observe({ entryTypes: ['navigation'] });
              }

              // API performance tracking
              window.apiPerformance = {
                trackApiCall: function(endpoint, startTime, endTime, success) {
                  const duration = endTime - startTime;
                  console.log('API Call:', endpoint, 'Duration:', duration, 'ms', 'Success:', success);
                }
              };
            `,
          }}
        />
      </body>
    </html>
  );
}
