import Image from "next/image";
import { Header } from "@/component/Header";
import Layout from "@/component/Layout";

export default function Home() {
  return (
    <Layout>
      <main>
        <Header />
      </main>
    </Layout>
  );
}
