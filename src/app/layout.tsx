import AuthProvider from "@/context/AuthProvider";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      
    >
      <AuthProvider>
      <body className="min-h-full flex flex-col">{children}</body>
      </AuthProvider>
    </html>
  );
}
