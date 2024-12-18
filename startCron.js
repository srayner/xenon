const { checkEndpoint } = require("./lib/endpointService");
const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client"); // Import Prisma Client for DB interactions

const prisma = new PrismaClient(); // Instantiate the Prisma Client

// Poll every minute for this example. You can adjust the frequency as needed.
cron.schedule("*/5 * * * * *", async () => {
  console.log("Running the cron job every 5 seconds");

  try {
    // Fetch all the endpoints from the database
    const endpoints = await prisma.endpoint.findMany();

    // Loop through all the endpoints and check each one
    for (const endpoint of endpoints) {
      await checkEndpoint(endpoint); // Check the endpoint's status
    }
  } catch (error) {
    console.error("Error fetching endpoints or checking status:", error);
  }
});
