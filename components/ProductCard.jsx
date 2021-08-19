import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart.slice';
import styles from '../styles/ProductsPage.module.css';

// Import the images so that the placeholder blur effect works
import one from "../public/pexels-anna-shvets-3786131.png";
import two from "../public/pexels-anna-shvets-3987147.png";
import three from "../public/pexels-anna-shvets-5953620.png";
import four from  "../public/pexels-anna-shvets-3962343.png";
import five from "../public/pexels-anna-shvets-5218012.png";
import six from "../public/bee_essential_mug.png";
import seven from "../public/eye_bee_m_cap.png";
import eight from "../public/eye_bee_m_sweatshirt.png";
import noodles from "../public/pexels-alena-shekhovtcova-6940988.png";

const ProductCard = ({ product, image }) => {
  const dispatch = useDispatch();
    return (
    <div className={styles}>
        <Image className={styles.img} alt={product.product} src={product.image} placeholder="blur" height={420} width={280}/>
      <h4 className={styles.title}>{product.product}</h4>
      <h5 className={styles.category}>{product.category}</h5>
      <p>$ {product.price}</p>
            <div className={styles.info}>
                <button
                    onClick={() => dispatch(addToCart(product))}
                    className={styles.button}
                >
                    Add to Cart
                </button>
            </div>
    </div>
  );
};

export default ProductCard;
