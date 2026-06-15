import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../_app';
import styles from './[id].module.css';
import { GetProductResponse, Product } from '../../types';
import { fetchGraphQL } from '../../utils/fetchGraphQL';
import { formatPrice } from '../../utils/formatPrice';
import Image from 'next/image';

export default function ProductPage() {
  const router = useRouter();
  const cart = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = (router.query.id as string) || '';

    const loadProduct = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const { product } = await fetchGraphQL<GetProductResponse>(
          `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          name
          description
          price
          category
          imageUrl
          stock
          createdAt
          }
          }
          `,
          { id },
        );
        setProduct(product);
      } catch (e) {
        console.error(`Failed to load product ${router.query.id}`, e);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [router.query.id]);

  const handleAddToCart = () => {
    if (!product) return;

    const currentItems = [
      ...(cart.cart || []),
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ];
    let runningTotal = 0;
    for (let i = 0; i < currentItems.length; i++) {
      runningTotal += currentItems[i].price * currentItems[i].quantity;
    }
    console.log('cart total after add:', runningTotal);

    cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
        {!product && !isLoading && <p>Product not found</p>}
        {product && (
          <>
            <div className={styles.imageWrapper}>
              <Image
                src={product.imageUrl}
                width="600"
                height="400"
                alt={product.name}
                className={styles.image}
              />
            </div>
            <div className={styles.details}>
              <p className={styles.category}>{product.category}</p>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.price}>{formatPrice(product.price)}</p>
              <p className={styles.description}>{product.description}</p>
              <p className={styles.meta}>
                Listed: {new Date(product.createdAt).toLocaleDateString()}
                {' · '}
                {product.stock} in stock
              </p>
              <button
                type="button"
                className={styles.addToCart}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
