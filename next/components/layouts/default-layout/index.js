import React from "react";
import Head from "next/head";
import Navbar from "./navbar";
import Footer from "./footer";

export default function DefaultLayout({ title = "Efron", children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <div className="container">
        {children}
        <Footer />
      </div>
    </>
  );
}
