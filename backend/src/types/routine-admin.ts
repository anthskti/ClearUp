import type { RoutineAuthor } from "./routine";
import type { SkinType } from "./product";

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
  author?: RoutineAuthor;
  skinTypeTags: SkinType[];
  /** First images from up to 4 routine products (URLs only; browser loads from origin CDN). */
  previewImageUrls: string[];
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
