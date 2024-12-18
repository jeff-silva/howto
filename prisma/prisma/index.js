import { execSync } from "child_process";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

const doCommand = (cmd) => {
  console.log(`-----------------------------------`);
  console.log(`>> ${cmd}`);
  console.log(`-----------------------------------`);
  try {
    const r = execSync(cmd);
    console.log(r.toString());
  } catch (e) {
    console.log(e.message);
  }
};

doCommand(`npx prisma db push`);

// (async () => {
//   const rand = Math.round(Math.random() * 999999);
//   console.log(
//     await prisma.app_user.create({
//       data: { name: `User ${rand}`, email: `user${rand}@grr.la` },
//     })
//   );
// })();
