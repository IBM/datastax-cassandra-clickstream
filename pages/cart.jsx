import Image from 'next/image';
import { getSession } from 'next-auth/client'
import { useSelector, useDispatch } from 'react-redux';
import { clickService} from "../services/clicks.service";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '../redux/cart.slice';
import styles from '../styles/CartPage.module.css';

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getTotalPrice = () => {
    return cart.reduce(
      (accumulator, item) => accumulator + item.quantity * item.price,
      0
    ).toLocaleString("en-US", {style:"currency", currency:"USD"});
  };

  return (
    <div className={styles.container}>
      {cart.length === 0 ? (
        <h1>Your Cart is Empty!</h1>
      ) : (
        <>
          <div className={styles.header}>
            <div>Image</div>
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Actions</div>
            <div>Total Price</div>
          </div>
          {cart.map((item) => (
            <div key={item.id} className={styles.body}>
              <div className={styles.image}>
                <Image alt={item.id} src={item.image} height="90" width="65" />
              </div>
              <p>{item.product}</p>
              <p>{item.price.toLocaleString("en-US", {style:"currency", currency:"USD"})}</p>
              <p>{item.quantity}</p>
              <div className={styles.buttons}>
                <button onClick={() => dispatch(incrementQuantity(item.id))}>
                  +
                </button>
                <button onClick={() => dispatch(decrementQuantity(item.id))}>
                  -
                </button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>
                  x
                </button>
              </div>
              <p>{(item.quantity * item.price).toLocaleString("en-US", {style:"currency", currency:"USD"})}</p>
            </div>
          ))}
          <h2>Grand Total: {getTotalPrice()}</h2>
        </>
      )}
    </div>
  );
}

export default CartPage;

export async function getServerSideProps(context) {
  clickService.trackPageBrowsing(getSession(context), "/cart");
  return { props: { } };
}
