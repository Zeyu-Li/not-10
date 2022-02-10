// Next.js API route support: https://nextjs.org/docs/api-routes/introductionNext.js

const games = [];
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
export default function handler(req, res) {
  const uid = uniqueId();
  games.push(uid);
  res.status(200).json({ id: uid });
}
