import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/auth/AuthModal";

import ContextProvider from "@/context/ContextProvider";

export const metadata = {
  title: "chessu",
  description: "Play Chess online."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>
          <Navbar />

          <main className="mx-1 flex min-h-[70vh] justify-center md:mx-16 lg:mx-40">
            {children}
          </main>

          <AuthModal />
        </ContextProvider>

        <Footer />
      </body>
    </html>
  );
}
