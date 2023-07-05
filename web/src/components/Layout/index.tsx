import { Footer } from "./Footer";
import { Header } from "./Header";
import { PropsWithChildren } from "react";
import "./index.css";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="layout">
      <Header />
      <div>{children}</div>
      <Footer />
    </main>
  );
};
