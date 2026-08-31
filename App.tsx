import { HashRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./store/store";
import Layout, { ScrollToTop } from "./components/Layout";
import Home from "./pages/Home";
import { Collections, CollectionDetail } from "./pages/Collections";
import { VelasAromaticas, Massagem, Kits } from "./pages/Catalog";
import Product from "./pages/Product";
import { OndeComprar, Sobre, Entrega } from "./pages/Company";
import { Encomendas, Faq, Contato } from "./pages/Help";
import Ritual from "./pages/Ritual";
import Admin from "./pages/admin/Admin";

export default function App() {
  return (
    <StoreProvider>
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
            <Route path="/onde-comprar" element={<OndeComprar />} />
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
    </StoreProvider>
  );
}
