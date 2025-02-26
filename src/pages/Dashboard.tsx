import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Api } from '../utils/api';
import { BackupTypeIcon } from '../components/BackupTypeIcon';
import { Backup } from '../types/backup';
import { BackupResponse } from '../types/backupResponse';
import { Header } from '../components/Header';

const Dashboard = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        setTotalPages(Math.ceil(response.pagination.total / response.pagination.per_page));
      } catch (error) {
        console.error('Failed to fetch backups:', error);
      }
    };

    fetchBackups();
  }, [currentPage]);

  const handleCreateBackup = (fromId: string) => {
    console.log('Create backup from', fromId);
    setActionMenuOpen(null);
  };

  const handleRestore = (id: string) => {
    console.log('Restore backup', id);
    setActionMenuOpen(null);
};

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
                        <div className="dropdown dropdown-end">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === backup.id ? null : backup.id)}
                            className="btn btn-ghost btn-sm btn-circle"
                          >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {actionMenuOpen === backup.id && (
                            <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-60 p-2 shadow-lg">
                              <li>
                                <button
                                  onClick={() => handleCreateBackup(backup.id)}
                                  className="text-sm"
                                >
                                  Create backup from here
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleRestore(backup.id)}
                                  className="text-sm"
                                >
                                  Restore to folder
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleRestore(backup.id)}
                                  className="text-sm"
                                >
                                  Restore to database
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center py-4">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn btn-sm">
                  Page {currentPage} of {totalPages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
