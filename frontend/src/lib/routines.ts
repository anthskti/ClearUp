import { Routine, RoutineWithProducts, RoutineProduct } from "@/types/routine";
import { ProductCategory } from "@/types/product";

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

export const createRoutine = async (data: {
  name: string;
  description?: string;
  items: {
    productId: number;
    category: string;
  }[];
}): Promise<RoutineWithProducts> => {
  const url = `${API_URL}/api/routines/bulk`;
  console.log("Creating routine at:", url);
  console.log("Request data:", data);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  // Check content type before trying to parse JSON
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Non-JSON response:", text.substring(0, 200));
    throw new Error(
      `Server returned ${res.status} ${res.statusText}. Expected JSON but got ${contentType}. Check if the backend server is running.`,
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
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Faild to delete routine #${id}`);
  }
  return true;
};
