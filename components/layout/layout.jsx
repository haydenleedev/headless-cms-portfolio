/* Nested naming so you can quickly find the files with ctrl + P in VS Code
Becomes a nightmare to manage if they're all named index.jsx... */
import Footer from "./footer/footer";
import Navbar from "./navbar/navbar";
import Message from "./message/message";

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
