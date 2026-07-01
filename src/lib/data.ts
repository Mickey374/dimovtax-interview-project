import { Project } from "./types";
import { headers } from "next/headers";

// Function to fetch projects from DB-Client Side
export const getProjects = async (): Promise<Project[]> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie");
    const requestHeaders = new Headers();
    if (cookie) {
      requestHeaders.set("cookie", cookie);
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/projects`, {
      cache: "no-store",
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch projects: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getProjects:", error);
    return [];
  }
};
