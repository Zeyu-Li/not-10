import { Server } from "socket.io";
import { prisma } from "../../lib/prisma";

const MOVES = [1, 2, 3];
const MAX_SCORE = 10;

// Client payloads are JSON strings; anything malformed is ignored.
const parse = (data) => {
  try {
    const { id, token, number } = JSON.parse(data);
    return typeof id === "string" && typeof token === "string"
      ? { id, token, number }
      : null;
  } catch {
    return null;
  }
};

// The game and the seat (1 or 2) the token belongs to, or null for anyone else.
const findSeat = async ({ id, token }) => {
  const game = await prisma.game.findUnique({ where: { uid: id } });
  if (!game) return null;
  const player =
    token === game.person1 ? 1 : token === game.person2 ? 2 : null;
  return player && { game, player };
};

// game.turn is true while it is player 1's turn
const isTurnOf = (game, player) => game.turn === (player === 1);

const stateFor = ({ game, player }) => ({
  turn: isTurnOf(game, player),
  score: game.score,
});

// An async listener that throws would be an unhandled rejection, which stops the server.
const safely = (listener) => async (data) => {
  try {
    await listener(data);
  } catch (error) {
    console.error(error);
  }
};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on(
        "input-change",
        safely(async (data) => {
          const request = parse(data);
          const seat = request && (await findSeat(request));
          if (!seat) return;
          const { game, player } = seat;

          const valid =
            MOVES.includes(request.number) &&
            game.score < MAX_SCORE &&
            isTurnOf(game, player);
          // Conditional on the state just read, so concurrent moves cannot both apply.
          const { count } = valid
            ? await prisma.game.updateMany({
                where: { uid: game.uid, score: game.score, turn: game.turn },
                data: {
                  turn: !game.turn,
                  score: Math.min(game.score + request.number, MAX_SCORE),
                },
              })
            : { count: 0 };

          const current = await findSeat(request);
          if (count === 0) {
            // rejected: undo the move the client already showed
            socket.emit("fetched-info", stateFor(current));
            return;
          }
          socket.to(game.uid).emit("update-change", current.game.score);
        })
      );

      socket.on(
        "fetch-info",
        safely(async (data) => {
          const request = parse(data);
          const seat = request && (await findSeat(request));
          if (!seat) return;
          socket.join(seat.game.uid);
          socket.emit("fetched-info", stateFor(seat));
        })
      );
    });
  }
  res.end();
};

export default SocketHandler;
