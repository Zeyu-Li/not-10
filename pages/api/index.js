import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * from https://stackoverflow.com/a/62189798/12539335
 * @param {*} length length of uid
 * @returns
 */
const uniqueId = (length = 16) => {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace(".", ""),
    10
  );
};

// TODO: set up db
const handler = async (req, res) => {
  const match = await prisma.game.findFirst({ where: { isLooking: true } });
  console.log(match);

  const uid = uniqueId();
  const userId = uniqueId();
  games.push(uid);
  res.status(200).json({ id: uid });
};
export default handler;
