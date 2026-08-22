import "./globals.css";

export const metadata = {
  title: "Test Boti App",
  description: "Gerado com Next.js",
};

import QueryProvider from "../providers/QueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
