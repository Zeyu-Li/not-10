import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";

export default function Game() {
  const { id } = useRouter().query;
  const [turn, changeTurn] = useState(true);
  const [total, setTotal] = useState(0);
  const nums = [1, 2, 3];

  const addValue = (number) => {
    if (!turn) return;
    changeTurn(!turn);
    setTotal(total + number);

    // send to server + auth token
    console.log(id);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Don{"'"}t say 10</title>
        <meta name="description" content="Don't say 10 game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Don{"'"}t Say 10</h1>
        <p className={styles.description}>
          {turn ? "Your Turn" : "Waiting for opponent"}
        </p>
        <p className={styles.currentValue}>{total}</p>

        <div className={styles.grid}>
          {nums.map((num) => {
            return (
              <a
                key={num}
                className={`${styles.card} ${
                  turn ? "" : styles.selectableDisabled
                }`}
                onClick={() => addValue(num)}
              >
                <h2 style={{ textAlign: "center" }}>+{num}</h2>
                <p style={{ textAlign: "center" }}>Adds {num} for your turn</p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://andrewli.site" target="_blank" rel="noreferrer">
          Made by Andrew
        </a>
        <Link href="/">Quit</Link>
      </footer>
    </div>
  );
}
