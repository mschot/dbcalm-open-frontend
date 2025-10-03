export interface BackupResponse {
  items: {
    id: string;
    from_backup_id: number | null;
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