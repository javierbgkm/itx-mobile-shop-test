import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { addProductToCart, fetchProductDetail } from "../services/api";
import type { ProductDetail, ProductOptionItem } from "../types/product";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | undefined>();
  const [selectedStorage, setSelectedStorage] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { updateCount } = useCart();

  useEffect(() => {
    if (!id) {
      return;
    }

    let mounted = true;
    setLoading(true);
    fetchProductDetail(id)
      .then((data) => {
        if (!mounted) {
          return;
        }

        setProduct(data);
        const initialColor = resolveColorOptions(data)[0]?.code;
        const initialStorage = resolveStorageOptions(data)[0]?.code;
        setSelectedColor(initialColor);
        setSelectedStorage(initialStorage);
        setError(null);
      })
      .catch(() => {
        if (mounted) {
          setError("No se pudo obtener información del producto.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const attributes = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      { label: "Marca", value: product.brand },
      { label: "Modelo", value: product.model },
      { label: "Precio", value: product.price ? `${product.price} €` : undefined },
      { label: "CPU", value: product.cpu },
      { label: "RAM", value: product.ram },
      { label: "Sistema Operativo", value: product.os },
      { label: "Pantalla", value: product.displayResolution || product.displayType },
      { label: "Batería", value: product.battery },
      { label: "Cámara principal", value: normalizeCamera(product.primaryCamera) },
      { label: "Cámara frontal", value: normalizeCamera(product.secondaryCmera) },
      { label: "Dimensiones", value: product.dimentions },
      { label: "Peso", value: product.weight && `${product.weight} g` },
    ].filter((item) => Boolean(item.value));
  }, [product]);

  const colors = product ? resolveColorOptions(product) : [];
  const storages = product ? resolveStorageOptions(product) : [];

  const handleAddToCart = async () => {
    const notSelected = !product || !id || selectedColor === undefined || selectedStorage === undefined;
    if (notSelected) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await addProductToCart({
        id,
        colorCode: selectedColor,
        storageCode: selectedStorage,
      });
      updateCount(response.count);
      setFeedback("Producto añadido a la cesta correctamente.");
    } catch {
      setFeedback("Error al añadir el producto a la cesta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Estamos cargando la información del producto...</p>;
  }

  if (error) {
    return <div className="status-box">{error}</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <section className="detail-layout">
      <div className="detail-panel">
        <img src={product.imgUrl} alt={`${product.brand} ${product.model}`} />
        <p>
          <Link to="/">Volver al listado</Link>
        </p>
      </div>

      <div className="detail-panel">
        <h1>{product.brand}</h1>
        <h2>{product.model}</h2>
        <ul className="attributes-list">
          {attributes.map((attribute) => (
            <li key={attribute.label}>
              <span>{attribute.label}</span>
              <span>{attribute.value}</span>
            </li>
          ))}
        </ul>

        <div className="selector-group">
          <label htmlFor="color-selector">Color</label>
          <select
            id="color-selector"
            value={selectedColor ?? ""}
            onChange={(event) => setSelectedColor(Number(event.target.value))}
          >
            {colors.map((color) => (
              <option key={color.code} value={color.code}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        <div className="selector-group">
          <label htmlFor="storage-selector">Almacenamiento</label>
          <select
            id="storage-selector"
            value={selectedStorage ?? ""}
            onChange={(event) => setSelectedStorage(Number(event.target.value))}
          >
            {storages.map((storage) => (
              <option key={storage.code} value={storage.code}>
                {storage.name}
              </option>
            ))}
          </select>
        </div>

        {feedback && <div className="status-box">{feedback}</div>}

        <button className="action-button" type="button" onClick={handleAddToCart} disabled={isSubmitting}>
          {isSubmitting ? "Añadiendo..." : "Añadir al carrito"}
        </button>
      </div>
    </section>
  );
};

function resolveColorOptions(product: ProductDetail): ProductOptionItem[] {
  if (product.options?.colors?.length) {
    return product.options.colors;
  }

  if (product.colors?.length) {
    return product.colors.map((name, idx) => ({ code: idx, name }));
  }

  return [{ code: 0, name: "Único color" }];
}

function resolveStorageOptions(product: ProductDetail): ProductOptionItem[] {
  if (product.options?.storages?.length) {
    return product.options.storages;
  }

  if (product.internalMemory?.length) {
    return product.internalMemory.map((name, idx) => ({ code: idx, name }));
  }

  return [{ code: 0, name: "Única opción" }];
}

function normalizeCamera(value?: string[] | string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

export default ProductDetailPage;
