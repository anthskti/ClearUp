export type AdminStats = {
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

export type FeaturedRoutineView = {
  routineId: number;
  name: string;
  description?: string;
  userId: string;
  pinnedBy: string;
};

export type RoutineDailyCountRow = {
  day: string | Date;
  count: string | number;
};

export type TopAuthorCountRow = {
  userId: string;
  count: string | number;
};

export type FeaturedRoutineEntryRow = {
  routineId: number;
  pinnedBy: string;
  createdAt?: string | Date;
};

export type RoutineSummaryRow = {
  id: number;
  name: string;
  description?: string;
  userId: string;
};
