import "./globals.css";
import localFont from "next/font/local";

const titania = localFont({ src: "../fonts/Titania.ttf" });
const martianMono = localFont({ src: "../fonts/MartianMono.ttf" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full`}>
        <div className={`h-full relative ${martianMono.className}`}>
          {/* Overlay UI */}
          <h1 className={`absolute top-8 left-8 font-bold text-6xl`}>
            BJORN VERBAKEL
          </h1>
          {/* 3D */}
          {children}
        </div>
      </body>
    </html>
  );
}
