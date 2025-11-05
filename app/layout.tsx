"use client";

import { Poppins } from "next/font/google";
import "@/_styles/globals.css";
import { GeneralHeader } from "@/_components/navigation/general/general-header";
import { GeneralFooter } from "@/_components/navigation/general/footer/general-footer";
import { AuthProvider } from "@/_lib/auth/auth-context";
import { ReCaptchaProvider } from "@/_components/providers/recaptcha-provider";
import { usePathname } from "next/navigation";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "optional",
  weight: ["500", "600", "700"],
});

/* export const metadata: Metadata = {
  metadataBase: new URL("https://automarketplaceqld.com.au"),
  title: "Auto Marketplace QLD - Australia",
  description:
    "Auto Marketplace QLD is your trusted online portal for selling vehicles across Queensland. Whether you're upgrading, downsizing, or simply ready to move on, we're here to make it easy, fast, and secure to sell your car with confidence. Sell smarter and faster every time.",
  keywords:
    "auto marketplace, sell car, Queensland, vehicle sales, online car selling, fast car sales, secure car selling, trusted car marketplace, Queensland vehicles, sell your car QLD",
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
}; */

function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dealer-portal");

  return (
    <html lang="en">
      <body className={`${poppinsFont.variable} antialiased`}>
        <ReCaptchaProvider>
          <AuthProvider initialUser={null}>
            {!isDashboard && <GeneralHeader />}
            {children}
            {!isDashboard && <GeneralFooter />}
          </AuthProvider>
        </ReCaptchaProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}
