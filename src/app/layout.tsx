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
      <body className={`h-full ${martianMono.className}`}>
        <div className="h-full relative">
          {/* Overlay UI */}
          <div className="absolute top-8 left-8">
            BJORN VERBAKEL
          </div>
          {/* 3D */}
          {children}
        </div>
      </body>
    </html>
  );
}
