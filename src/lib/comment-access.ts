import { Role } from "@prisma/client";

export const canAccessProjectComments = (user: { id: string; role?: Role }, projectUserId: string | null) =>
  user.role === Role.ADMIN || projectUserId === user.id;
