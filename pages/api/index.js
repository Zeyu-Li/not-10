import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * from https://stackoverflow.com/a/62189798/12539335
 * @param {*} length length of uid
 * @returns
 */
const uniqueId = (length = 16) => {
  return Math.ceil(Math.random() * Date.now())
    .toPrecision(length)
    .toString()
    .replace(".", "");
};

// TODO: set up db
const handler = async (req, res) => {
  const match = await prisma.game.findFirst({ where: { isLooking: true } });
  // no logging :(

  const userId = uniqueId();
  if (match) {
    // console.log(match);
    // console.log(match.uid);
    // get match and update
    await prisma.game.update({
      where: { id: match.id },
      data: { person2: userId, isLooking: false },
    });
    res.status(200).json({ id: match.uid });
    return;
  }

  // else generate game
  const uid = uniqueId();
  await prisma.game.create({
    data: {
      isLooking: true,
      uid,
      person1: userId,
    },
  });
  res.status(200).json({ id: uid });
};

// websockets

export default handler;
