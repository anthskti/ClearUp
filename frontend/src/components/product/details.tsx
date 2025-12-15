import { ReactNode } from "react";
import { Info, Droplets, MapPin, FlaskConical } from "lucide-react";

export interface CategoryConfigEntry {
  sheet: DetailSheet[];
}

export interface DetailSheet {
  label: string;
  dataKey: string;
  icon: ReactNode;
}

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
        dataKey: "label[1]",
        icon: <Info size={16} />,
      },
      {
        label: "Filter",
        dataKey: "label[2]",
        icon: <Info size={16} />,
      },
      {
        label: "Key Active",
        dataKey: "label[2]",
        icon: <Info size={16} />,
      },
    ],
  },
};

export type CategoryKey = keyof typeof DETAIL_CONFIG;
