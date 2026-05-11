export type UserDailyCountRow = {
  day: string | Date; // Written like this for sequelize unknown type just for safety.
  count: string | number;
};

export type BasicUserRow = {
  id: string;
  name: string;
  email: string;
};

export type AdminUserListRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
};