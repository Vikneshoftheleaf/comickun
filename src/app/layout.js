import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ComicKun",
  description: "Free manga and manwa readind site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Navbar/>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
