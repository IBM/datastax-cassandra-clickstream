import Head from 'next/head'
import Category from '../components/Category'
import styles from '../styles/Home.module.css'
import {clickService} from "../services/clicks.service";
import { getSession } from 'next-auth/client'
import masksAndSan from '../public/masks_and_sanitizer.png';
import essentials from '../public/essentials.png';
import diversity from '../public/bee_diverse.png';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="A clickstream generator for DataStax" />
      </Head>

        <i>
            Select a shopping category
        </i>
        <div className={styles.wide}>
            <Category image={essentials} name="Essentials" />
            <Category image={masksAndSan} name="Masks and Sanitizer" />
            <Category image={diversity} name="Bee Swag" />
        </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  clickService.trackPageBrowsing(getSession(context), "/");
  return { props: { } };
}
