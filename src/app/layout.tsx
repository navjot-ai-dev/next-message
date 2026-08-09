import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast"


const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" className={cn("font-sans", geist.variable)}
      
    >
      <AuthProvider>
      <body className="min-h-full flex flex-col">{children}
      <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
