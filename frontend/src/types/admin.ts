export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
};

export type AdminUsersPagePayload = {
  users: AdminUserRow[];
  total: number;
  limit: number;
  offset: number;
};
