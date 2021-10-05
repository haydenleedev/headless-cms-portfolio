// import Head from 'next/head'
// import Image from 'next/image'
import Layout from "../components/layout/layout";

export default function Home() {
  return (
    // Real content will be passed down to Layout as props later on...
    <Layout>
      <section className="section">
        <div className="container">
          <h1>Become Your Customers' Favorite Brand</h1>
          <p>
            Deliver simple, elegant CX with the world’s most advanced cloud
            contact center
          </p>
        </div>
      </section>
      <hr></hr>
      <section className="section">
        <div className="container">
          <h1>Header 1</h1>
          <h2>Header 2</h2>
          <h3>Header 3</h3>
          <h4>Header 4</h4>
          <h5>Header 5</h5>
          <h6>Header 6</h6>
          <p>Paragraph</p>
        </div>
      </section>
    </Layout>
  );
}
