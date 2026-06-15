import React from 'react';
import styles from './ProductCard.module.css';
import { Product } from '../types';
import Link from 'next/link';
import { formatPrice } from '../utils/formatPrice';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className={styles.card} data-testid="product-card">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width="300"
        height="200"
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price} data-testid="product-price">
          {formatPrice(product.price)}
        </p>
        <div className={styles.actions}>
          <Link href={`/product/${product.id}`} className={styles.button}>
            View product
          </Link>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              type="button"
              className={styles.addToCart}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
