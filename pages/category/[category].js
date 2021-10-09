import { useRouter } from 'next/router';
import ProductCard from '../../components/ProductCard';
import styles from '../../styles/Cards.module.css';
import { getProductsByCategory } from '../api/products/[category]';
import {clickService} from "../../services/clicks.service";
import { getSession } from 'next-auth/client'

import { useEffect } from "react";

const CategoryPage = ({ products, started }) => {
  const router = useRouter();

  useEffect(() => {
    console.log("BROWSING: ", router.query.category);

    return () => {
      const ended = Math.round(Date.now()/1000);
      console.log("LEAVING: ", router.query.category);
      console.log("Time on page (secs): ", ended - started);
    };
  });

  return (
    <div className={styles.container}>
      <p>Products in the <i>{router.query.category}</i> category:</p>
      <div className={styles.cards}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} image={product.image} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

export async function getServerSideProps(ctx) {

  const started = Math.round(Date.now()/1000);
  const category = ctx.query.category;
  clickService.trackPageBrowsing(getSession(ctx), "/category/" + category);
  const products = await getProductsByCategory(category);
  return { props: { products, started } };
}
