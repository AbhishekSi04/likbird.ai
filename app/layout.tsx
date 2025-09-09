import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Linkbird Platform",
  description: "Leads and campaigns platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const t = localStorage.getItem('theme');
              const m = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
            } catch {}
          `,
          }}
        />
        {children}
      </body>
    </html>
  );
}


