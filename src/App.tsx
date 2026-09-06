import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./store/store";
import { CartProvider } from "./store/cart";
import Layout, { ScrollToTop } from "./components/Layout";
import Home from "./pages/Home";
import { Collections, CollectionDetail } from "./pages/Collections";
import { VelasAromaticas, Massagem, Kits } from "./pages/Catalog";
import Product from "./pages/Product";
import { Sobre, Entrega } from "./pages/Company";
import { Encomendas, Faq, Contato } from "./pages/Help";
import { Cart, Checkout, OrderConfirm } from "./pages/Shop";
import Ritual from "./pages/Ritual";
import Admin from "./pages/admin/Admin";

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/colecoes" element={<Collections />} />
              <Route path="/colecoes/:slug" element={<CollectionDetail />} />
              <Route path="/velas" element={<VelasAromaticas />} />
              <Route path="/velas-de-massagem" element={<Massagem />} />
              <Route path="/kits" element={<Kits />} />
              <Route path="/produto/:slug" element={<Product />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido/confirmacao" element={<OrderConfirm />} />
              <Route path="/onde-comprar" element={<Navigate to="/velas" replace />} />
              <Route path="/entrega" element={<Entrega />} />
              <Route path="/encomendas" element={<Encomendas />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/ritual" element={<Ritual />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </StoreProvider>
  );
}
