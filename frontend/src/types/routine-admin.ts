export type AdminDashboardStats = {
  totals: {
    users: number;
    routines: number;
    routineProductLinks: number;
    featuredRoutines: number;
  };
  series: {
    date: string;
    users: number;
    routines: number;
  }[];
  topAuthors: {
    userId: string;
    name: string;
    email: string;
    count: number;
  }[];
};
