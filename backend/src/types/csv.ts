export type CsvRowError = {
    row: number;
    code: string;
    message: string;
  };
  
  export type CsvImportResult = {
    ok: boolean;
    importType: "products" | "prices";
    message: string;
    totals: {
      received: number;
      processed: number;
      created: number;
      updated: number;
      skipped: number;
      failed: number;
    };
    errors: CsvRowError[];
    durationMs: number;
    processed: number;
    created: number;
    updated: number;
    skipped?: number;
    updatedOffers?: number;
  };
  