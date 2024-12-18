// app/api/getEndpoints/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetch all endpoints with their most recent history
    const endpoints = await prisma.endpoint.findMany({
      include: {
        history: {
          take: 1, // Get the latest history entry
          orderBy: {
            timestamp: "desc", // Sort by the most recent
          },
        },
      },
    });

    // Return the data as a JSON response
    return new Response(JSON.stringify(endpoints), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch data: " + error }),
      {
        status: 500,
      }
    );
  }
}
