import React from 'react';
import Link from 'next/link';
import {
  AiOutlineShoppingCart,
  AiOutlineShop,
  AiOutlineSearch,
  AiOutlineLogin,
  AiOutlineLogout,
 } from 'react-icons/ai';
import { useSession } from 'next-auth/client'
import { useSelector } from 'react-redux';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import styles from '../styles/AppHeader.module.css';

const AppHeader = () => {
  const [ session ] = useSession()
  const cart = useSelector((state) => state.cart);
  const count = cart.length  // unique items in cart

  return (
      <header aria-label="Bee-Commerce Essentials">
        <div>
          <div className={styles.cust}>
            {!session && <>
              <p className={styles.cust}>
              <strong>You are not signed in.</strong>&nbsp;&nbsp;
              Customer ID: #<strong>0</strong>&nbsp;&nbsp;
              <Link href={`/api/auth/signin`} >
                <a>Sign in &nbsp;<AiOutlineLogin  size={12} color="indigo"/></a>
              </Link>
              </p>
            </>}
            {session && <>
              <p className={styles.cust}>
              Signed in as: <strong>{session.name}</strong>&nbsp;&nbsp;
              Customer ID: #<strong>{session.sub}</strong>&nbsp;&nbsp;
              <Link href={`/api/auth/signout`} >
                <a>Sign out &nbsp;<AiOutlineLogout  size={12} color="indigo"/></a>
              </Link>
              </p>
            </>}
          </div>
        </div>
        <nav className={styles.nav}>
            <h1 className={styles.h1}><b>Bee-Commerce</b> <i>Essentials</i></h1>
            <ul className={styles.links}>
              <li className={styles.link}>
                <Link aria-label="Home" href="/" >
                  <a><AiOutlineShop size={30} color="indigo" /></a>
                </Link>
              </li>
              <li className={styles.link}>
                <Link aria-label="Search" href="/products" >
                  <a><AiOutlineSearch size={30} color="indigo" /></a>
                </Link>
              </li>
              {session && <>
                <li className={styles.link}>
                  <Link aria-label="Cart" href="/cart" >
                    <a><AiOutlineShoppingCart  size={30} color="indigo" /></a>
                  </Link>
                  </li>
                <li className={styles.link}>
                <NotificationBadge count={count} effect={Effect.SCALE}/>
                </li>
              </>}
            {!session && <>
                <li className={styles.link}>
              <Link href={`/api/auth/signin`} >
                <a><AiOutlineLogin  size={30} color="indigo"/></a>
              </Link>
              </li>
            </>}
            </ul>
        </nav>
    </header>
  );
};

export default AppHeader;