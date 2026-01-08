import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';

const App = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<p>La página solicitada no existe.</p>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
