import { useRouter } from 'next/router';
import ProductCard from '../../components/ProductCard';
import styles from '../../styles/Cards.module.css';
import { getProductsByCategory } from '../api/products/[category]';
import {clickService} from "../../services/clicks.service";
import { getSession } from 'next-auth/client'

const CategoryPage = ({ products }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <p>Products in the "{router.query.category}" category:</p>
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
  const category = ctx.query.category;
  clickService.trackPageBrowsing(getSession(ctx), "/category/" + category);
  const products = await getProductsByCategory(category);
  return { props: { products } };
}
