export interface FilterOption {
  id: string;
  label: string;
  options: string[];
}

export interface CategoryConfigEntry {
  category: string;
  specificFilters: FilterOption[];
  tableColumns: ColumnConfig[];
}

export interface ColumnConfig {
  id: string;
  label: string;
  width: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfigEntry> = {
  cleanser: {
    category: "Cleansers",
    specificFilters: [
      {
        id: "texture",
        label: "Texture",
        options: ["Oil", "Balm", "Gel", "Foam", "Milk"],
      },
    ],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-6" },
      { id: "texture", label: "Texture", width: "col-span-1" },
      { id: "skinType", label: "SkinType", width: "col-span-1" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },
  toner: {
    category: "Toners",
    specificFilters: [
      {
        id: "benefits",
        label: "Benefits",
        options: ["Hydrating", "Exfoliating", "Calming"],
      },
    ],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-6 text-left" },
      { id: "benefits", label: "Benefits", width: "col-span-1" },
      { id: "skinType", label: "SkinType", width: "col-span-1" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },
  essence: {
    category: "Essences",
    specificFilters: [
      {
        id: "effect",
        label: "Effect",
        options: ["Hydrating", " Calming", "Brightening", "Nourishing"],
      },
    ],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-6 text-left" },
      { id: "effect", label: "Effect", width: "col-span-1" },
      { id: "skinType", label: "SkinType", width: "col-span-1" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },
  serum: {
    category: "Serums",
    specificFilters: [
      {
        id: "activeIngredient",
        label: "Active Ingredient",
        options: ["Vitamin C", "Hyaluronic Acid", "Niacinamide", "Ampoule"],
      },
    ],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-5" },
      { id: "ac", label: "Active Ingredient", width: "col-span-2" },
      { id: "skinType", label: "SkinType", width: "col-span-1" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },
  moisturizer: {
    category: "Moisturizers",
    specificFilters: [
      {
        id: "texture",
        label: "Texture",
        options: ["Gels", "Cream", "Ointment", "Lotion"],
      },
    ],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-5 text-left" },
      { id: "texture", label: "Texture", width: "col-span-1" },
      { id: "skinType", label: "SkinType", width: "col-span-2" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },
  sunscreen: {
    category: "Sunscreens",
    specificFilters: [
      { id: "spf", label: "SPF Level", options: ["15+", "30+", "50+"] },
      {
        id: "filter",
        label: "Filter",
        options: ["Mineral", "Chemical", "Hybrid"],
      },
      { id: "finish", label: "Finish", options: ["Matte", "Dewy", "Natural"] },
    ],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-4 text-left" },
      { id: "spf", label: "Spf", width: "col-span-1" },
      { id: "filter", label: "Filter", width: "col-span-1" },
      { id: "finish", label: "Finish", width: "col-span-1" },
      { id: "skinType", label: "SkinType", width: "col-span-1" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },

  default: {
    category: "Other",
    specificFilters: [],
    tableColumns: [
      { id: "name", label: "Product", width: "col-span-6 text-left" },
      { id: "skinType", label: "SkinType", width: "col-span-2" },
      { id: "country", label: "Country", width: "col-span-1" },
      { id: "rating", label: "Rating", width: "col-span-1 text-center" },
      { id: "price", label: "Price", width: "col-span-1 text-right" },
      { id: "add", label: "", width: "col-span-1" },
    ],
  },
};

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
