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
        console.log(game);
        const newGameState = await prisma.game.update({
          where: { uid: id },
          data: { turn: !game.turn, score: game.score + number },
        });
        console.log(newGameState);

        if (number === 1 || number === 2 || number === 3) {
          socket.broadcast.emit("update-change", newGameState.score);
        } else {
          socket.broadcast.emit("update-change", 3);
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
