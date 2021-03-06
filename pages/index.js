import Head from "next/head";
import Image from "next/image";
import { get } from "../components/utils";
import styles from "../styles/Home.module.css";

export default function Home() {
  const startNewGame = () => {
    // go to new game
    get()
      .then((res) => res.json())
      .then((data) => {
        // this is the new game id
        window.open(
          `${window.location.origin}/game/${data.id}?player=${data.user}`,
          "_self"
        );
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Don{"'"}t say 10</title>
        <meta name="description" content="Don't say 10 game" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6540565217666405"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Don{"'"}t Say 10</h1>
        <p className={styles.description}></p>

        <div className={styles.gridMain}>
          <a
            className={styles.card}
            onClick={startNewGame}
            style={{ width: 250 }}
          >
            <h2 style={{ textAlign: "center" }}>New Game</h2>
            <p style={{ textAlign: "center" }}>Starts a new game</p>
          </a>

          {/* <a className={styles.card} style={{ width: 250 }}>
            <h2 style={{ textAlign: "center" }}>Rules</h2>
            <p style={{ textAlign: "center" }}>Rules of the game</p>
          </a> */}
          <a
            className={styles.card}
            href="https://github.com/sponsors/Zeyu-Li"
            style={{ width: 250 }}
            target="_blank"
            rel="noreferrer"
          >
            <h2 style={{ textAlign: "center" }}>Support the creator</h2>
            <p style={{ textAlign: "center" }}>On GitHub</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://andrewli.site" target="_blank" rel="noreferrer">
          Made by Andrew
        </a>
      </footer>
    </div>
  );
}
