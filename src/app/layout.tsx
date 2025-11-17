'use client';

import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { useEffect } from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Wake up Render backend on app load
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
          await fetch(apiUrl, { method: 'GET' });
        }
      } catch (error) {
        // Silently fail - this is just a wake-up call
        console.log('Backend wake-up call completed');
      }
    };
    
    wakeUpBackend();
  }, []);

  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Smartsupp Live Chat */}
        <Script
          id="smartsupp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '5329de6bb4cfa3d7a34d7cd82b1af6c2b228f4d9';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `,
          }}
        />
      </body>
    </html>
  );
}
