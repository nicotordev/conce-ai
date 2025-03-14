import type { Metadata } from "next";
import { Inter, Lato, Lora, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";
import { Toaster } from "react-hot-toast";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lato = Lato({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Condor AI",
  description: "Condor AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${poppins.variable} ${spaceGrotesk.variable} ${lato.variable} antialiased`}
    >
      <body>
        {children} <Toaster position="top-center" reverseOrder={false} />
      </body>
      <PrelineScript />
    </html>
  );
}
