import DefaultLayout from "./layouts/DefaultLayout"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage";
import Winepage from "./pages/Winepage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import GlobalContext from "./contexts/globalContext";
import { useState } from "react";
import Loader from "./components/Loader";
import Chatbot from "./components/Chatbot";
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading }}>
      <Chatbot />
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<Homepage />}></Route>
            <Route path="/wine/:id" element={<Winepage />}></Route>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/categoria/:id" element={<CategoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
};

export default App
