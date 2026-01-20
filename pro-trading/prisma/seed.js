const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.note.count();

  if (count === 0) {
    await prisma.note.createMany({
      data: [
        { title: "Первая заметка из seed-скрипта" },
        { title: "Вторая заметка, загруженная из PostgreSQL" },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

