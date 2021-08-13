import ProductCard from '../components/ProductCard';
import styles from '../styles/ProductsPage.module.css';
import { getProducts } from './api/products/index';
import { clickService } from "../services/clicks.service";

import { getSession } from 'next-auth/client'

const ProductsPage = ({ products }) => {

    return (
    <div className={styles.container}>
        <h1 className={styles.title}>All Results</h1>
      <div className={styles.cards}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} image={product.image} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;

export async function getServerSideProps(context) {
  clickService.trackPageBrowsing(getSession(context), "/products");
  const products = await getProducts();
  return { props: { products } };
}
