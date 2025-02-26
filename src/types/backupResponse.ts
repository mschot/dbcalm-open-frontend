export interface BackupResponse {
  items: {
    identifier: string;
    from_identifier: string | null;
    start_time: string;
    end_time: string;
  }[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}