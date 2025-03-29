import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import localFont from "next/font/local";
import { Inter, Lora, Poppins } from "next/font/google";
const clashGrotesk = localFont({
  src: "../fonts/ClashGrotesk-Variable.ttf",
  variable: "--font-clash-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Conce.ia",
  description: "Conce.ia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${clashGrotesk.variable} ${inter.variable} ${lora.variable} ${poppins.variable} antialiased`}
    >
      <body>
        <Providers>{children}</Providers>{" "}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
