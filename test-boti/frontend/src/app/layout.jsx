import "./globals.css";

export const metadata = {
  title: "Test Boti App",
  description: "Gerado com Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
