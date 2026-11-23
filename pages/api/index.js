import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";

// Joins a waiting game or starts a new one. The token is the player's secret for making moves.
const handler = async (req, res) => {
  const token = randomUUID();
  const match = await prisma.game.findFirst({ where: { isLooking: true } });

  if (match) {
    // only takes the seat if no one else took it in the meantime
    const { count } = await prisma.game.updateMany({
      where: { id: match.id, isLooking: true },
      data: { person2: token, isLooking: false },
    });
    if (count === 1) {
      res.status(200).json({ id: match.uid, user: 2, token });
      return;
    }
  }

  // else generate game
  const uid = randomUUID();
  await prisma.game.create({
    data: {
      isLooking: true,
      uid,
      person1: token,
    },
  });
  res.status(200).json({ id: uid, user: 1, token });
};

export default handler;
