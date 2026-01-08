import { Link } from 'react-router-dom';
import type { ProductSummary } from '../types/product';

interface ProductCardProps {
  product: ProductSummary;
}

const formatPrice = (price?: string | number) => {
  if (price === undefined || price === null || price === '') {
    return 'Consultar precio';
  }

  const numeric = Number(price);
  if (Number.isNaN(numeric)) {
    return 'Consultar precio';
  }

  const normalized = Number.isInteger(numeric) ? numeric.toString() : numeric.toFixed(2);
  return `${normalized} €`;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const title = `${product.brand} ${product.model}`.trim();

  return (
    <Link className="product-card" to={`/product/${product.id}`}>
      <img src={product.imgUrl} alt={title} loading="lazy" />
      <div>
        <h3>{title}</h3>
        <p>{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
