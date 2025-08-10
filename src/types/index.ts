export type PdfFileWithPreview = File & { 
  id: string;
  thumbnailUrl?: string;
  pageCount?: number;
  isLoading?: boolean;
};