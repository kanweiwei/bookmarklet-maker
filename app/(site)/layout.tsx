import { PropsWithChildren } from "react";
import Header from "./_components/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative pt-12">
      <Header />
      {children}
    </div>
  );
}
