export type UserDailyCountRow = {
  day: string | Date; // Written like this for sequelize unknown type just for safety.
  count: string | number;
};

export type BasicUserRow = {
  id: string;
  name: string;
  email: string;
};
