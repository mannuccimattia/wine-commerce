import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import DefaultLayout from "./layouts/DefaultLayout"
import Homepage from "./pages/Homepage";
import Winepage from "./pages/Winepage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsPage from "./pages/ProductsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from './pages/CategoryPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import SuccessPage from './pages/SuccessPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import GlobalContext from "./contexts/globalContext";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [toDisable, setToDisable] = useState(false);
  const [homeSearch, setHomeSearch] = useState("");

  return (
    <GlobalContext.Provider value={{
      isLoading,
      setIsLoading,
      toDisable,
      setToDisable,
      homeSearch,
      setHomeSearch
    }}>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<Homepage />}></Route>
            <Route path="/wine/:id" element={<Winepage />}></Route>
            <Route path="/products" element={<ProductsPage />} />
            <Route path={`/search`} element={<SearchResultsPage />} />
            <Route path="/categoria/:id" element={<CategoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="*" element={<NotFoundPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
};

export default App
