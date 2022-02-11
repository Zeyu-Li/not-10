import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const match = await prisma.game.findFirst({ where: { uid: req.id } });
  await prisma.game.update({
    where: { uid: req.id },
    data: { deletedAt: new Date() },
  });
  res.status(200).json({ id: match.uid });
};
export default handler;
