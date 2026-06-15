import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _ from 'lodash';
import { CartContext } from '../pages/_app';
import { SearchDialog } from './SearchDialog';
import { CartIcon } from './cartIcon';
import { useDebounce } from '../hooks/useDebounce';
import styles from './Header.module.css';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { SearchProductsResponse, SearchResult } from '../types';

export function Header() {
  const router = useRouter();
  const cart = useContext(CartContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const searchProducts = async (): Promise<void> => {
      try {
        const { searchProducts } = await fetchGraphQL<SearchProductsResponse>(
          `
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
          { q: debouncedQuery },
        );

        setResults(_.slice(searchProducts, 0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    searchProducts();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push('/search?q=' + encodeURIComponent(query));
      setIsOpen(false);
    }
  };

  const isActivePage = (path: string) => {
    return router.pathname.indexOf(path) !== -1;
  };

  const truncatedQuery = query.substr(0, 30);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Kramp
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/"
            className={
              isActivePage('/') && router.pathname === '/'
                ? styles.activeLink
                : styles.navLink
            }
          >
            Home
          </Link>
          <Link
            href="/search"
            className={
              isActivePage('/search') ? styles.activeLink : styles.navLink
            }
          >
            Products
          </Link>
          <Link
            href="/checkout"
            className={
              isActivePage('/checkout') ? styles.activeLink : styles.navLink
            }
          >
            Checkout
          </Link>
        </nav>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            value={query}
            placeholder="Search products..."
            className={styles.searchInput}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
          />
          {truncatedQuery && query.length > 30 && (
            <span className={styles.truncatedHint}>
              Searching: {truncatedQuery}…
            </span>
          )}
          {isOpen && (
            <SearchDialog
              results={results}
              onSelect={(id: string) => {
                router.push(`/product/${id}`);
                setIsOpen(false);
                setQuery('');
              }}
            />
          )}
        </div>

        <CartIcon count={cart.totalItems} />
      </div>
    </header>
  );
}
