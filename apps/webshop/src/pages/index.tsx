import { GetServerSideProps } from 'next';
import ProductCard from '../components/ProductCard';
import styles from './index.module.css';
import { GetProductsResponse, Product } from '../types';
import { fetchGraphQL } from '../utils/fetchGraphQL';

interface HomePageProps {
  featured: Product[];
  timestamp: number;
}

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  const FEATURED_IDS = ['1', '4', '11', '17'];

  const getProducts = async (ids: string[]): Promise<Product[]> => {
    try {
      const { products } = await fetchGraphQL<GetProductsResponse>(
        `
            query GetProducts($ids: [ID!]!) {
              products(ids: $ids) {
                id
                name
                price
                imageUrl
                description
                category
                stock
                createdAt
              }
            }
            `,
        { ids },
      );
      console.log('Fetched featured products:', products);
      return products;
    } catch (e) {
      console.error(`Failed to load featured products ${ids}`, e);
      return [];
    }
  };
  const featured = await getProducts(FEATURED_IDS);

  return {
    props: {
      featured: featured,
      timestamp: Date.now(),
    },
  };
};

export default function HomePage({ featured, timestamp }: HomePageProps) {
  return (
    <div>
      <section className={styles.hero}>
        <img
          src="https://placehold.co/1200x800/e63329/ffffff?text=Kramp+Webshop"
          alt="Kramp — Your industrial supply partner"
          loading="lazy"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Industrial supplies, delivered.</h1>
          <p className={styles.heroSubtitle}>
            Tools, fasteners, safety equipment and power tools for
            professionals.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <h2>Featured products</h2>
          <p className={styles.timestamp}>
            Last updated: {new Date(timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className={styles.grid}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <h2>Shop by category</h2>
        <div className={styles.categoryGrid}>
          {['Tools', 'Fasteners', 'Safety Equipment', 'Power Tools'].map(
            (cat, index) => (
              <a
                key={index}
                href={`/search?q=${cat}`}
                className={styles.categoryCard}
              >
                {cat}
              </a>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
