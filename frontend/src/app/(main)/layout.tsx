import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthSync } from "@/components/auth/AuthSync";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AuthSync />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
