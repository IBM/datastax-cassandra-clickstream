import { clickService } from "../services/clicks.service";
import { getSession } from 'next-auth/client'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

const History = ({ customer_id }) => {

  console.log("History page Customer ID:", customer_id);

  const { data, error } = useSWR("/api/history", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Clickstream History</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>
          Your clickstream history from the DataStax database:
        </h1>
      </main>

      <pre>{JSON.stringify(data, null, 2)}</pre>

    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const customer_id = session?.sub || 0;
  clickService.trackPageBrowsing(session, "/welcome");
  return { props: { customer_id } };
}

export default History;
