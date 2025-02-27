import React from 'react';
import { useState } from 'react';

interface BackupActionMenuProps {
  backupId: string;
}

export const BackupActionMenu: React.FC<BackupActionMenuProps> = ({
  backupId,
}) => {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const isOpen = menuOpen === backupId

  const handleCreateBackup = (fromId: string) => {
    console.log('Create backup from', fromId);
    setMenuOpen(null);
  };

  const handleRestore = (id: string) => {
    console.log('Restore backup', id);
    setMenuOpen(null);
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
              onClick={() => handleRestore(backupId)}
              className="text-sm"
            >
              Restore to folder
            </button>
          </li>
          <li>
            <button
              onClick={() => handleRestore(backupId)}
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
