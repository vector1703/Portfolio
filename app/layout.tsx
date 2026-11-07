import type { Metadata } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prahaspathi | Full Stack Developer",
  description:
    "Portfolio of Prahaspathi, a Full Stack Developer interested in web technologies and cybersecurity.",
};

// Runs before the page paints so the saved light/dark choice never flashes.
const themeScript = `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
