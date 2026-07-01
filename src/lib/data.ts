import { Project } from "./types";
import { UserListItem } from "./types";
import { headers } from "next/headers";

// Function to fetch projects from DB-Client Side
export const getProjects = async ({ limit }: { limit?: number } = {}): Promise<Project[]> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie");
    const requestHeaders = new Headers();
    if (cookie) {
      requestHeaders.set("cookie", cookie);
    }

    const url = new URL(`${process.env.NEXTAUTH_URL}/api/projects`);
    if (limit) {
      url.searchParams.append("limit", String(limit));
    }

    const response = await fetch(url.toString(), {
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

// Function to fetch users from DB-Client Side
export const getUsers = async (): Promise<UserListItem[]> => {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie");
    const requestHeaders = new Headers();
    if (cookie) {
      requestHeaders.set("cookie", cookie);
    }

    const url = new URL(`${process.env.NEXTAUTH_URL}/api/users`);
    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch users: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};
