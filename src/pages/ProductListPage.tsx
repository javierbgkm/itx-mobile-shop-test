import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import type { ProductSummary } from '../types/product';

const ProductListPage = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (mounted) {
          setProducts(data);
          setError(null);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('No se ha podido obtener la información de los productos.');
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedQuery = search.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.brand} ${product.model}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [products, normalizedQuery]);

  return (
    <section>
      <div className="search-bar">
        <input
          id="product-search"
          type="search"
          placeholder="Busca por marca o modelo"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p>Estamos cargando los productos...</p>}
      {error && <div className="status-box">{error}</div>}

      {!loading && !error && filteredProducts.length === 0 && <p>No hay productos que coincidan con la búsqueda.</p>}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="card-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductListPage;
