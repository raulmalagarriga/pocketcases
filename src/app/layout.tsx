import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pocket Cases | Fundas con Puro Estilo Y2K y Protección MagSafe en Venezuela",
  description:
    "Fundas estéticas y resistentes contra caídas de 3m, con protección militar, MagSafe y vibra retro Y2K. Envíos a toda Venezuela y atención rápida por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
