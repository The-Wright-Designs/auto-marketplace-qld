import { Poppins } from "next/font/google";
import { Metadata } from "next";
import "@/_styles/globals.css";
import { ClientLayout } from "@/_components/layout/client-layout";
import { getCurrentUser } from "@/_lib/auth/get-current-user";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${poppinsFont.variable} antialiased`}>
        <ClientLayout initialUser={user}>{children}</ClientLayout>
      </body>
    </html>
  );
}
