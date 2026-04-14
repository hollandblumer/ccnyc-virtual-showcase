// src/app/layout.tsx
import "./globals.css";
import PasswordGate from "@/components/PasswordGate"; // Path should work now

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
