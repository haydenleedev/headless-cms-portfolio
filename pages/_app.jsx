import "../styles/main.scss";
import GlobalContextWrapper from "../context/globalContextWrapper";

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextWrapper>
      <Component {...pageProps} />
    </GlobalContextWrapper>
  );
}

export default MyApp;
