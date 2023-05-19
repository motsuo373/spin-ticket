import Head from "next/head";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        {/* タブのタイトルを設定 */}
        <title>もつおバウンティ</title>

        {/* ファビコンを設定 */}
        <link rel="icon" href="/target.png" />
      </Head>

      {children}
    </>
  );
};

export default Layout;
