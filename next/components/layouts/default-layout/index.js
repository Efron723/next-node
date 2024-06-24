import React from "react";
import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";

export default function DefaultLayout({ children, title = "", pageName = "" }) {
  return (
    <>
      <Head>
        <title>{title ? "Efron | " + title : "Efron"}</title>
      </Head>
      <Navbar {...{ pageName }} />
      <div className="container">{children}</div>
      <Footer />
    </>
  );
}
