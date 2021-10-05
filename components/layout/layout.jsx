import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import Message from "./message";

const Layout = ({ children }) => {
  return (
    <>
      <Message></Message>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer></Footer>
    </>
  );
};

export default Layout;
