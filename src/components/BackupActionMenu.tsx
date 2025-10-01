import React from 'react';
import { useState } from 'react';
import { Api } from '../utils/api';
import { useProcessMonitor } from '../hooks/useProcessMonitor';

interface BackupActionMenuProps {
  backupId: string;
}

export const BackupActionMenu: React.FC<BackupActionMenuProps> = ({
  backupId,
}) => {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const isOpen = menuOpen === backupId;
  const { startMonitoring } = useProcessMonitor();

  const handleCreateBackup = async (fromId: string) => {
    try {
      const response = await Api.post('/backups', {
        type: 'incremental',
        from_backup_id: fromId
      });
      startMonitoring(response, 'incremental_backup');
      setMenuOpen(null);
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup. Please try again.');
    }
  };

  const handleRestore = async (id: string, target: 'folder' | 'database') => {
    try {
      const response = await Api.post('/restore', {
        id,
        target
      });
      startMonitoring(response, 'restore');
      setMenuOpen(null);
    } catch (error) {
      console.error('Failed to restore backup:', error);
      alert('Failed to restore backup. Please try again.');
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        onClick={() => setMenuOpen(isOpen ? null : backupId)}
        className="btn btn-ghost btn-sm btn-circle"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-60 p-2 shadow-lg">
          <li>
            <button
              onClick={() => handleCreateBackup(backupId)}
              className="text-sm"
            >
              Create backup from here
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRestore(backupId, 'folder')}
              className="text-sm"
            >
              Restore to folder
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRestore(backupId, 'database')}
              className="text-sm"
            >
              Restore to database
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
