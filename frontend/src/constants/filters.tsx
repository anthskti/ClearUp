export interface FilterOption {
  id: string;
  labels: string;
  options: string[];
}

export interface CategoryConfigEntry {
  category: string;
  specificFilters: FilterOption[];
  tableColumns: ColumnConfig[];
}

export interface ColumnConfig {
  id: string;
  labels: string;
  width: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfigEntry> = {
  cleanser: {
    category: "Cleansers",
    specificFilters: [
      {
        id: "texture",
        labels: "Texture",
        options: ["Oil", "Balm", "Gel", "Foam", "Milk"],
      },
    ],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-6" },
      { id: "texture", labels: "Texture", width: "col-span-1" },
      { id: "skinType", labels: "SkinType", width: "col-span-1" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },
  toner: {
    category: "Toners",
    specificFilters: [
      {
        id: "benefits",
        labels: "Benefits",
        options: ["Hydrating", "Exfoliating", "Calming"],
      },
    ],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-6 text-left" },
      { id: "benefits", labels: "Benefits", width: "col-span-1" },
      { id: "skinType", labels: "SkinType", width: "col-span-1" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },
  essence: {
    category: "Essences",
    specificFilters: [
      {
        id: "effect",
        labels: "Effect",
        options: ["Hydrating", " Calming", "Brightening", "Nourishing"],
      },
    ],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-6 text-left" },
      { id: "effect", labels: "Effect", width: "col-span-1" },
      { id: "skinType", labels: "SkinType", width: "col-span-1" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },
  serum: {
    category: "Serums",
    specificFilters: [
      {
        id: "activeIngredient",
        labels: "Active Ingredient",
        options: ["Vitamin C", "Hyaluronic Acid", "Niacinamide", "Ampoule"],
      },
    ],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-5" },
      { id: "ac", labels: "Active Ingredient", width: "col-span-2" },
      { id: "skinType", labels: "SkinType", width: "col-span-1" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },
  moisturizer: {
    category: "Moisturizers",
    specificFilters: [
      {
        id: "texture",
        labels: "Texture",
        options: ["Gels", "Cream", "Ointment", "Lotion"],
      },
    ],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-6 text-left" },
      { id: "texture", labels: "Texture", width: "col-span-1" },
      { id: "skinType", labels: "SkinType", width: "col-span-1" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },
  sunscreen: {
    category: "Sunscreens",
    specificFilters: [
      { id: "spf", labels: "SPF Level", options: ["15+", "30+", "50+"] },
      {
        id: "filter",
        labels: "Filter",
        options: ["Mineral", "Chemical", "Hybrid"],
      },
      { id: "finish", labels: "Finish", options: ["Matte", "Dewy", "Natural"] },
    ],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-4 text-left" },
      { id: "spf", labels: "Spf", width: "col-span-1" },
      { id: "filter", labels: "Filter", width: "col-span-1" },
      { id: "finish", labels: "Finish", width: "col-span-1" },
      { id: "skinType", labels: "skinType", width: "col-span-1" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },

  default: {
    category: "All",
    specificFilters: [],
    tableColumns: [
      { id: "name", labels: "Product", width: "col-span-6 text-left" },
      { id: "skinType", labels: "SkinType", width: "col-span-2" },
      { id: "country", labels: "Country", width: "col-span-1" },
      { id: "rating", labels: "Rating", width: "col-span-1 text-center" },
      { id: "price", labels: "Price", width: "col-span-1 text-right" },
      { id: "add", labels: "", width: "col-span-1" },
    ],
  },
};

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
