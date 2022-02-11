import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io from "Socket.IO-client";
import styles from "../../styles/Home.module.css";
let socket;

export default function Game() {
  const { id, player } = useRouter().query;
  const [turn, changeTurn] = useState(player == 1);
  const [total, setTotal] = useState(0);
  const [finishedModal, setFinishedModal] = useState(false);
  const [win, setWin] = useState(false);
  const nums = [1, 2, 3];

  const addValue = (number) => {
    if (!turn) return;
    changeTurn(!turn);

    // check 10
    if (total + number < 11) {
      setTotal(total + number);
    } else {
      // you lose
      setTotal(10);
      setFinishedModal(true);
      setWin(false);
      console.log("You lose");
    }

    // send to server + auth token
    // console.log(id, player);
    socket.emit("input-change", JSON.stringify({ number, id, player }));
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      socket.emit("fetch-info", JSON.stringify({ id, player }));
      console.log("connected websockets!");
    });

    socket.on("update-change", (newTotal) => {
      if (newTotal !== total) changeTurn(!turn);
      setTotal(newTotal);
    });

    socket.on("fetched-info", (data) => {
      const { turn, score } = data;
      setTotal(score);
      // if the opponent gets 10 u win!
      if (score > 9 && !finishedModal) {
        setWin(true);
        setFinishedModal(true);
      }
      changeTurn(turn);
    });
  };

  useEffect(() => socketInitializer(), []);

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
        {finishedModal ? (
          <p>{win ? "You won!!" : "You lost, try again"}</p>
        ) : null}

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
