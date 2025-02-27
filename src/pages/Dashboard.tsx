import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Api } from '../utils/api';
import { BackupTypeIcon } from '../components/BackupTypeIcon';
import { Backup } from '../types/backup';
import { BackupResponse } from '../types/backupResponse';
import { Header } from '../components/Header';
import { Pagination, PaginationResponse } from '../components/Pagination';
import { BackupActionMenu } from '../components/BackupActionMenu';

const Dashboard = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationResponse, setPaginationResponse] = useState<PaginationResponse>({
    total: 0,
    page: 1,
    per_page: 25,
    total_pages: 1
  });

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const response = await Api.get(`/backups?order=start_time:desc&page=${currentPage}`) as BackupResponse;
        const formattedBackups = response.items.map(item => ({
          id: item.identifier,
          type: item.from_identifier === null ? 'full' : 'incremental',
          created: new Date(item.start_time)
        }));
        setBackups(formattedBackups);
        setPaginationResponse(response.pagination);
      } catch (error) {
        console.error('Failed to fetch backups:', error);
      }
    };

    fetchBackups();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto">
        <Header />

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-base-content">Type</th>
                    <th className="text-base-content">Identifier</th>
                    <th className="text-base-content">Created</th>
                    <th className="text-right text-base-content">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr key={backup.id} className="hover">
                      <td>
                        <BackupTypeIcon type={backup.type} />
                      </td>
                      <td className="font-medium">{backup.id}</td>
                      <td>{format(backup.created, 'MMM d, yyyy HH:mm')}</td>
                      <td className="text-right">
                        <BackupActionMenu
                          backupId={backup.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              paginationResponse={paginationResponse}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;