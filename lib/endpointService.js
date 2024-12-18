const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to check the endpoint and log the results
async function checkEndpoint(endpoint) {
  try {
    const { default: fetch } = await import("node-fetch");

    const start = Date.now();
    const response = await fetch(endpoint.url);
    const responseTime = Date.now() - start;

    await prisma.history.create({
      data: {
        endpointId: endpoint.id,
        responseTime: responseTime,
        responseCode: response.status,
        success: response.ok,
      },
    });

    await prisma.endpoint.update({
      where: { id: endpoint.id },
      data: {
        status: response.ok ? "success" : "failure",
        lastChecked: new Date(),
      },
    });

    console.log(
      `Checked ${endpoint.url}: ${response.status} in ${responseTime}ms`
    );
  } catch (error) {
    console.error(`Error checking ${endpoint.url}: ${error.message}`);

    // Log the failure with the error message in the history table
    await prisma.history.create({
      data: {
        endpointId: endpoint.id,
        success: false,
        responseTime: 0, // No response time on failure
        responseCode: 0, // No status code on failure
        errorMessage: error.message, // Store the error message
      },
    });

    // Also update the `lastErrorMessage` in the endpoint table to reflect the most recent error
    await prisma.endpoint.update({
      where: { id: endpoint.id },
      data: {
        status: "error",
        lastChecked: new Date(),
        lastErrorMessage: error.message, // Store the last error message on the endpoint itself
      },
    });
  }
}

module.exports = { checkEndpoint };
