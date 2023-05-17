import Image from "next/image";
import { Inter } from "next/font/google";
import { Header } from "@/component/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Header />
    </main>
  );
}
