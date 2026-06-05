import type { RoutineProductInput } from "@/types/builder";
import { mutationHeaders } from "@/lib/mutationHeaders";
import {
  Routine,
  RoutineWithProducts,
  FeaturedRoutine,
  GuideRoutine,
  RoutineNoteUpdate,
} from "@/types/routine";
import type { AdminDashboardStats } from "@/types/routine-admin";
import { SkinType } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const getRoutineById = async (id: string): Promise<Routine> => {
  const res = await fetch(`${API_URL}/api/routines/id/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch routine ${id}`);
  }
  return res.json();
};

export const getAllRoutines = async (
  limit = 100,
  offset = 0,
): Promise<RoutineWithProducts[]> => {
  const res = await fetch(
    `${API_URL}/api/routines?limit=${limit}&offset=${offset}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch routines");
  }

  return res.json();
};

export const getAdminDashboardStats = async (
  days = 14,
): Promise<AdminDashboardStats> => {
  const res = await fetch(`${API_URL}/api/routines/admin/stats?days=${days}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to load admin dashboard stats" }));
    throw new Error(errorData.error || "Failed to load admin dashboard stats");
  }

  return res.json();
};

export const getFeaturedRoutines = async (): Promise<FeaturedRoutine[]> => {
  const res = await fetch(`${API_URL}/api/routines/admin/featured`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to load featured routines" }));
    throw new Error(errorData.error || "Failed to load featured routines");
  }
  return res.json();
};

// Public endpoint for landing page (no auth).
export async function getPublicFeaturedRoutines(): Promise<FeaturedRoutine[]> {
  const res = await fetch(`${API_URL}/api/routines/featured`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to load featured routines" }));
    throw new Error(errorData.error || "Failed to load featured routines");
  }
  return res.json();
}

export async function getPublicGuides(params: {
  tags?: string;
  minPrice?: string;
  maxPrice?: string;
  limit?: number;
  offset?: number;
}): Promise<GuideRoutine[]> {
  const search = new URLSearchParams();
  if (params.tags?.trim()) {
    search.set("tags", params.tags.trim());
  }
  if (params.minPrice?.trim()) {
    search.set("minPrice", params.minPrice.trim());
  }
  if (params.maxPrice?.trim()) {
    search.set("maxPrice", params.maxPrice.trim());
  }
  if (params.limit != null) {
    search.set("limit", String(params.limit));
  }
  if (params.offset != null) {
    search.set("offset", String(params.offset));
  }
  const qs = search.toString();
  const res = await fetch(
    `${API_URL}/api/routines/guides${qs ? `?${qs}` : ""}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to load guides" }));
    throw new Error(errorData.error || "Failed to load guides");
  }
  return res.json();
}

export const featureRoutine = async (routineId: number): Promise<void> => {
  const res = await fetch(
    `${API_URL}/api/routines/admin/featured/${routineId}`,
    {
      method: "POST",
      headers: mutationHeaders(),
      credentials: "include",
    },
  );
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to feature routine" }));
    throw new Error(errorData.error || "Failed to feature routine");
  }
};

export const unfeatureRoutine = async (routineId: number): Promise<void> => {
  const res = await fetch(
    `${API_URL}/api/routines/admin/featured/${routineId}`,
    {
      method: "DELETE",
      headers: mutationHeaders(),
      credentials: "include",
    },
  );
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to remove featured routine" }));
    throw new Error(errorData.error || "Failed to remove featured routine");
  }
};

export const createRoutine = async (data: {
  name: string;
  description?: string;
  skinTypeTags?: SkinType[];
  items: RoutineProductInput[];
}): Promise<RoutineWithProducts> => {
  const url = `${API_URL}/api/routines/bulk`;
  // console.log("Creating routine at:", url);
  // console.log("Request data:", data);

  const res = await fetch(url, {
    method: "POST",
    headers: mutationHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });

  // Check content type before trying to parse JSON
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Server returned ${res.status} ${res.statusText}. Expected JSON but got ${contentType}.`,
    );
  }

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error ||
        `Failed to create routine: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
};

export const getRoutineWithProducts = async (
  id: string,
): Promise<RoutineWithProducts> => {
  const res = await fetch(`${API_URL}/api/routines/id/${id}/products`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch routine ${id}`);
  }
  return res.json();
};

// export const updateRoutineProductsById = async (
//   id: number,
//   items: RoutineProductInput[],
//   options?: { confirmClear?: boolean },
// ): Promise<{ ok: boolean }> => {
//   const res = await fetch(`${API_URL}/api/routines/id/${id}/products`, {
//     method: "PUT",
//     headers: mutationHeaders({ "Content-Type": "application/json" }),
//     credentials: "include",
//     body: JSON.stringify({
//       products: items,
//       items,
//       confirmClear: options?.confirmClear === true,
//     }),
//   });

//   if (!res.ok) {
//     const errorData = await res
//       .json()
//       .catch(() => ({ error: "Failed to update routine products" }));
//     throw new Error(errorData.error || "Failed to update routine products");
//   }

//   return res.json();
// };

export const saveRoutineNotes = async (
  routineId: number,
  updates: RoutineNoteUpdate[],
): Promise<void> => {
  const res = await fetch(`${API_URL}/api/routines/id/${routineId}/notes`, {
    method: "PATCH",
    headers: mutationHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to save routine notes" }));
    throw new Error(errorData.error || "Failed to save routine notes");
  }
};

export const addProductToRoutine = async (
  routineId: number,
  item: RoutineProductInput,
): Promise<void> => {
  const res = await fetch(`${API_URL}/api/routines/id/${routineId}/products`, {
    method: "POST",
    headers: mutationHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to add product to routine" }));
    throw new Error(errorData.error || "Failed to add product to routine");
  }
};

export const getRoutinesByUserId = async (
  userId: string,
): Promise<RoutineWithProducts[]> => {
  const res = await fetch(`${API_URL}/api/routines/user/${userId}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to get user routine`);
  }
  return res.json();
};

export const getMyRoutines = async (): Promise<RoutineWithProducts[]> => {
  const res = await fetch(`${API_URL}/api/routines/me`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to get authenticated user routines");
  }
  return res.json();
};

export const deleteRoutineById = async (id: number): Promise<boolean> => {
  const res = await fetch(`${API_URL}/api/routines/id/${id}`, {
    method: "DELETE",
    headers: mutationHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Faild to delete routine #${id}`);
  }
  return true;
};

export const updateRoutineById = async (
  id: number,
  data: { name?: string; description?: string; skinTypeTags?: SkinType[] },
): Promise<Routine> => {
  const res = await fetch(`${API_URL}/api/routines/id/${id}`, {
    method: "PUT",
    headers: mutationHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed to update routine" }));
    throw new Error(errorData.error || "Failed to update routine");
  }

  return res.json();
};
