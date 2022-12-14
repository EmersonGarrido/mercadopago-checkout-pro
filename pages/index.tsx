import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import mercadopago from "mercadopago";

const Home: NextPage = ({ data }: any) => {
  console.log(data);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <span>Nome: APROV</span>
          <span>Cartao Teste: 4235 6477 2802 5682</span>
          <span>CVV: 123</span>
          <span>DATE: 11/25</span>
          <span>CPF: 12345678909</span>

          <button onClick={() => window.open(`${data.init_point}`)}>
            COMPRAR CARAI
          </button>
        </div>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  mercadopago.configure({
    access_token: `${process.env.NEXT_PUBLIC_KEY}`,
  });

  const response = await mercadopago.preferences
    .create({
      items: [
        {
          title: "Meu produto",
          unit_price: 10.9,
          quantity: 1,
        },
      ],
      payment_methods: {
        default_payment_method_id: "pix",
        excluded_payment_types: [
          {
            id: "ticket",
          },
          {
            id: "credit_card",
          },
          {
            id: "debit_card",
          },
        ],
        excluded_payment_methods: [
          {
            id: "paypal",
          },
        ],
      },
      back_urls: {
        success: "http://localhost:3000/payments/success",
        pending: "http://localhost:3000/payments/pending",
        failure: "http://localhost:3000/payments/failure",
      },
      auto_return: "approved",
      payer: {
        name: "Mercadopago",
        email: "mercadopago@example.com",
      },
    })
    .then(function (response) {
      return response.body;
    })
    .catch(function (error) {
      console.log(error);
    });

  console.log(response);

  return {
    props: {
      data: response,
    },
  };
}

export default Home;
