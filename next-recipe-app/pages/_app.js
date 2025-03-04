// pages/_app.js
import { RecettesProvider } from "../context/RecettesContext";
import PropTypes from "prop-types";
import Header from "../components/Header";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <RecettesProvider initialRecettes={pageProps.recipes}>
      <Header />
      <Component {...pageProps} />
    </RecettesProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
