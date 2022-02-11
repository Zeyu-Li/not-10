import { Server } from "Socket.IO";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("input-change", async (data) => {
        const { number, id, player } = JSON.parse(data);
        const game = await prisma.game.findFirst({ where: { uid: id } });
        // console.log(game);
        let score = game.score;
        if (number === 1 || number === 2 || number === 3) {
          if (number + score > 10) {
            score = 10;
          } else {
            score += number;
          }
        }
        const newGameState = await prisma.game.update({
          where: { uid: id },
          data: { turn: !game.turn, score },
        });
        // console.log(newGameState);

        socket.broadcast.emit("update-change", newGameState.score);
      });

      socket.on("fetch-info", async (data) => {
        const { id, player } = JSON.parse(data);
        const game = await prisma.game.findFirst({ where: { uid: id } });

        socket.broadcast.emit("fetched-info", {
          turn: game.turn,
          score: game.score,
        });
      });
    });
  }
  res.end();
};

export default SocketHandler;
