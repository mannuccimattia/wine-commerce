import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import SearchLayout from "./layouts/SearchLayout";
import Homepage from "./pages/Homepage";
import Winepage from "./pages/Winepage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsPage from "./pages/ProductsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";
import "@fortawesome/fontawesome-free/css/all.min.css";
import GlobalContext from "./contexts/globalContext";
import { CarrelloProvider } from "./contexts/CartContext";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [toDisable, setToDisable] = useState(false);
  const [homeSearch, setHomeSearch] = useState("");

  const resetSearchField = () => {
    setHomeSearch("");
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        toDisable,
        setToDisable,
        homeSearch,
        setHomeSearch,
        resetSearchField,
      }}
    >
      <CarrelloProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route index element={<Homepage />}></Route>
              <Route path="/wine/:slug" element={<Winepage />}></Route>
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />

              <Route element={<SearchLayout />}>
                <Route path={`/search`} element={<SearchResultsPage />} />
              </Route>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="*" element={<NotFoundPage />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CarrelloProvider>
    </GlobalContext.Provider>
  );
}

export default App;
