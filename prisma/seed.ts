import { PrismaClient, Role, ProjectStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Database Seeding...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "software.demotest.2025@gmail.com" },
    update: {},
    create: {
      email: "software.demotest.2025@gmail.com",
      name: "Super Admin",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${adminUser.email}`);

  // Create 5 random users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const userPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: userPassword,
        role: Role.USER,
      },
    });
    users.push(user);
  }
  console.log(`✅ ${users.length} users created`);

  // Create Projects and Randomly assign them to users
  const statuses = [ProjectStatus.ACTIVE, ProjectStatus.ON_HOLD, ProjectStatus.COMPLETED];

  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.project.create({
      data: {
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        status: randomStatus,
        userId: randomUser.id,
        deadline: faker.date.future({ years: 1 }),
        budget: faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 }),
      },
    });
  }
  console.log(`✅ 20 projects created and assigned to random users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
