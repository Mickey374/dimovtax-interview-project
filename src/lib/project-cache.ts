const PROJECT_LIST_LIMITS = [undefined, 5] as const;

type ProjectCacheScope = "all" | "user";

export const getProjectCacheKey = ({
  scope,
  userId,
  limit,
}: {
  scope: ProjectCacheScope;
  userId?: string;
  limit?: number;
}) => {
  const suffix = limit ? String(limit) : "none";

  if (scope === "user") {
    if (!userId) {
      throw new Error("userId is required for user project cache keys");
    }

    return `projects:user:${userId}:${suffix}`;
  }

  return `projects:all:${suffix}`;
};

export const getProjectCacheKeysToInvalidate = (userIds: Array<string | null | undefined>) => {
  const keys = new Set<string>();

  for (const limit of PROJECT_LIST_LIMITS) {
    keys.add(getProjectCacheKey({ scope: "all", limit }));

    for (const userId of userIds) {
      if (userId) {
        keys.add(getProjectCacheKey({ scope: "user", userId, limit }));
      }
    }
  }

  return [...keys];
};