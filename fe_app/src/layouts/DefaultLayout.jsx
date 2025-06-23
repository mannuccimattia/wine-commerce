import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlobalContext from "../contexts/globalContext";
import Loader from "../components/Loader";
import Chatbot from "../components/Chatbot";

const DefaultLayout = () => {
  const { isLoading } = useContext(GlobalContext);
  return (
    <div className="site-wrapper d-flex flex-column min-vh-100">
      <header className="border-bottom border-secondary">
        <Header />
      </header>
      <main className="flex-grow-1">
        <Outlet />
        <Chatbot />
      </main>
      <Footer />
      {isLoading && <Loader />}
    </div>
  );
};

export default DefaultLayout;
