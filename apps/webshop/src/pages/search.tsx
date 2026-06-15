import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { groupBy } from '../utils/groupBy';
import ProductCard from '../components/ProductCard';
import styles from './search.module.css';
import { SearchProductsResponse, SearchResult } from '../types';

export default function SearchPage() {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = (router.query.q as string) || '';
    const fetchProducts = async (): Promise<void> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
            query SearchProducts($q: String!) {
              searchProducts(query: $q) {
                id
                name
                price
                imageUrl
                category
                description
                stock
                createdAt
              }
            }
          `,
            variables: { q },
          }),
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data: SearchProductsResponse = await response.json();

        setResults(data.data.searchProducts);
      } catch (error) {
        console.error(error);
        setError('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [router.query.q]);


  const grouped = useMemo(() => groupBy(results, 'category'), [results]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>
          {router.query.q ? `Results for "${router.query.q}"` : 'All products'}
        </h1>

        {isLoading && <p>Loading...</p>}

        {!isLoading && error && <p className={styles.error}>{error}</p>}

        {!isLoading && !error && !results.length && (
          <p className={styles.empty}>No products found.</p>
        )}

        {Object.keys(grouped).map(category => (
          <section key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.grid}>
              {grouped[category].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
