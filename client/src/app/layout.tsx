import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export const metadata = {
  title: "chessu",
  description: "Play Chess online."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main className="mx-1 flex min-h-[70vh] justify-center md:mx-16 lg:mx-40">{children}</main>

        <Footer />

        {/* auth modal, put in separate component */}
        <AuthModal />
      </body>
    </html>
  );
}
