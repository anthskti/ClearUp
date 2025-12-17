import { ReactNode } from "react";
import {
  Info,
  Droplets,
  MapPin,
  FlaskConical,
  TestTubeDiagonal,
  Bubbles,
} from "lucide-react";
import { Product } from "@/types/product";

export interface CategoryConfigEntry {
  sheet: DetailSheet[];
}

export interface DetailSheet {
  label: string;
  dataKey: string;
  icon: ReactNode;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const getProductData = (product: Product, dataKey: string) => {
  // Handle Array Access (mainly for "labels" and active ingredients)
  if (dataKey.includes("[")) {
    const [key, indexPart] = dataKey.split("["); // ["labels", "0]"]
    const index = parseInt(indexPart.replace("]", ""), 10); // 0

    // Safely check if the array exists
    const array = product[key as keyof Product];

    if (Array.isArray(array) && array[index]) {
      return capitalize(array[index]);
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
        label: "Active Ingredients",
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
        label: "Active Ingredients",
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
        label: "Active Ingredients",
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
        label: "Key Active",
        dataKey: "labels[0]",
        icon: <Droplets size={16} />,
      },
      {
        label: "Concentration",
        dataKey: "labels[1]",
        icon: <TestTubeDiagonal size={16} />,
      },
      {
        label: "Active Ingredients",
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
        label: "Finish",
        dataKey: "labels[1]",
        icon: <Bubbles size={16} />,
      },
      {
        label: "Active Ingredients",
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
        label: "Active Ingredients",
        dataKey: "activeIngredient",
        icon: <Info size={16} />,
      },
    ],
  },
};

export type CategoryKey = keyof typeof DETAIL_CONFIG;
