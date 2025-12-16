import { ReactNode } from "react";
import { Info, Droplets, MapPin, FlaskConical } from "lucide-react";
import { Product } from "@/types/product";

export interface CategoryConfigEntry {
  sheet: DetailSheet[];
}

export interface DetailSheet {
  label: string;
  dataKey: string;
  icon: ReactNode;
}

const getProductData = (product: Product, dataKey: string) => {
  // 1. Handle Array Access (e.g., "labels[0]")
  if (dataKey.includes("[")) {
    const [key, indexPart] = dataKey.split("["); // ["labels", "0]"]
    const index = parseInt(indexPart.replace("]", ""), 10); // 0

    // Safely check if the array exists
    const array = product[key as keyof Product];

    if (Array.isArray(array) && array[index]) {
      return array[index];
    }
    return "-"; // Fallback if data is missing
  }

  // 2. Handle Direct Access (e.g., "capacity", "country")
  const value = product[dataKey as keyof Product];

  // 3. Handle specific arrays like activeIngredient
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "-";
  }
  return value || "-";
};
export default getProductData;

export const DETAIL_CONFIG: Record<string, CategoryConfigEntry> = {
  cleanser: {
    sheet: [
      {
        label: "Capacity",
        dataKey: "capacity",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        dataKey: "country",
        icon: <MapPin size={16} />,
      },
      {
        label: "Texture",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "activeIngredient",
        icon: <Info size={16} />,
      },
    ],
  },
  toner: {
    sheet: [
      {
        label: "Capacity",
        dataKey: "capacity",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        dataKey: "country",
        icon: <MapPin size={16} />,
      },
      {
        label: "Benefits",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "activeIngredient",
        icon: <Info size={16} />,
      },
    ],
  },
  essence: {
    sheet: [
      {
        label: "Capacity",
        dataKey: "capacity",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        dataKey: "country",
        icon: <MapPin size={16} />,
      },
      {
        label: "Effect",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "activeIngredient",
        icon: <Info size={16} />,
      },
    ],
  },
  serum: {
    sheet: [
      {
        label: "Capacity",
        dataKey: "capacity",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        dataKey: "country",
        icon: <MapPin size={16} />,
      },
      {
        label: "Active Ingredient",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "activeIngredient",
        icon: <Info size={16} />,
      },
    ],
  },
  moisturizer: {
    sheet: [
      {
        label: "Capacity",
        dataKey: "capacity",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        dataKey: "country",
        icon: <MapPin size={16} />,
      },
      {
        label: "Texture",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "activeIngredient",
        icon: <Info size={16} />,
      },
    ],
  },
  sunscreen: {
    sheet: [
      {
        label: "Capacity",
        dataKey: "capacity",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        dataKey: "country",
        icon: <MapPin size={16} />,
      },
      {
        label: "SPF",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Finish",
        dataKey: "labels[1]",
        icon: <Info size={16} />,
      },
      {
        label: "Filter",
        dataKey: "labels[2]",
        icon: <Info size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "labels[2]",
        icon: <Info size={16} />,
      },
    ],
  },
};

export type CategoryKey = keyof typeof DETAIL_CONFIG;
