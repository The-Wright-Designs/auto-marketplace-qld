import { Poppins } from "next/font/google";
import { Metadata } from "next";
import Script from "next/script";
import "@/_styles/globals.css";
import { ClientLayout } from "@/_components/layout/client-layout";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "optional",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://automarketplaceqld.com.au"),
  title: "Auto Marketplace QLD - Australia",
  description:
    "Auto Marketplace QLD is your trusted online portal for selling vehicles across Queensland. Whether you're upgrading, downsizing, or simply ready to move on, we're here to make it easy, fast, and secure to sell your car with confidence. Sell smarter and faster every time.",
  keywords:
    "auto marketplace, sell car, Queensland, vehicle sales, online car selling, fast car sales, secure car selling, trusted car marketplace, Queensland vehicles, sell your car QLD",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    description:
      "Auto Marketplace QLD is your trusted online portal for selling vehicles across Queensland. Whether you're upgrading, downsizing, or simply ready to move on, we're here to make it easy, fast, and secure to sell your car with confidence. Sell smarter and faster every time.",
    type: "website",
    locale: "en_AU",
    siteName: "Auto Marketplace QLD - Australia",
    images: [
      {
        url: "/images/open-graph-image.webp",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsFont.variable} antialiased`}>
        <ClientLayout initialUser={null}>{children}</ClientLayout>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q9TGD9ZEWH"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-Q9TGD9ZEWH');`}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1856965224968912');fbq('track','PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1856965224968912&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
