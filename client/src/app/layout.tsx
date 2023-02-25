import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "chessu",
  description: "Play Chess online."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main className="bg-base-200 mx-1 flex min-h-[70vh] justify-center rounded-3xl shadow-md md:mx-16 lg:mx-40">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
