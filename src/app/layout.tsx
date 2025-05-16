import "./globals.css";
import localFont from "next/font/local";

const titania = localFont({ src: "../fonts/Titania.ttf" });
const martianMono = localFont({ src: "../fonts/MartianMono.ttf" });
const vcrOsdMono = localFont({ src: "../fonts/VCR_OSD_MONO.ttf" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full`}>
        {/* Overlay UI */}
        <div className={`h-full relative ${martianMono.className}`}>
          <div className={`absolute top-8 left-8 gap-4 flex flex-col z-10`}>
            <h1 className={`font-bold text-6xl`}>BJORN VERBAKEL</h1>
            <h2 className={`text-3xl`}>Front-end developer</h2>
            <nav className={`flex flex-col gap-2`}>
              <p>About</p>
              <p>Projects</p>
              <p>Contact</p>
            </nav>
          </div>
          {/* Cube */}
          {children}
        </div>
      </body>
    </html>
  );
}
