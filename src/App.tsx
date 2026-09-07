import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import { BlogList, BlogPostPage } from "./pages/Blog";
import Admin from "./pages/admin/Admin";

/** Compatibilidade: redireciona links antigos com # (ex.: /#/velas → /velas). */
function HashRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith("#/")) navigate(h.slice(1), { replace: true });
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <BrowserRouter>
          <HashRedirect />
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
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </StoreProvider>
  );
}
