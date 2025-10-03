import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../utils/api";
import { useProcessMonitor } from "../hooks/useProcessMonitor";

interface HeaderProps {
  currentPage?: "backups" | "clients" | "processes" | "restores";
}

export const Header = ({ currentPage = "backups" }: HeaderProps) => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [showRestoreInfo, setShowRestoreInfo] = useState(false);
  const navigate = useNavigate();
  const { startMonitoring, activeProcesses } = useProcessMonitor();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
  };

  const handleNewBackup = async (type: 'full' | 'incremental') => {
    try {
      const response = await Api.post('/backups', { type });
      const processType = type === 'full' ? 'full_backup' : 'incremental_backup';
      startMonitoring(response, processType);
      setCreateMenuOpen(false);
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup. Please try again.');
    }
  };

  const handleAddClient = () => {
    navigate('/add-client');
    setCreateMenuOpen(false);
  };

  const handleAddClick = (currentPage: string) => {
    if (currentPage === "backups") {
      setCreateMenuOpen(!createMenuOpen);
    } else if (currentPage === "clients") {
      handleAddClient();
    } else if (currentPage === "restores") {
      setShowRestoreInfo(true);
    }
  };

  return (
    <>
      {showRestoreInfo && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">How to Restore a Backup</h3>
            <p className="py-4">
              To restore a backup, go to the <a href="/dashboard" className="link link-primary">Backups page</a> and click the actions menu (⋮) on the backup you want to restore.
            </p>
            <div className="modal-action">
              <button onClick={() => setShowRestoreInfo(false)} className="btn">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6 mt-8">
          <h1 className="text-3xl font-bold text-primary">
            {currentPage === "backups" ? "Backups"
             : currentPage === "clients" ? "Clients"
             : currentPage === "processes" ? "Processes"
             : "Restores"}
          </h1>
        </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {activeProcesses.length > 0 && (
            <div className="flex items-center gap-2 text-sm opacity-70">
              <span className="loading loading-spinner loading-sm"></span>
              <span>{activeProcesses.length} process{activeProcesses.length > 1 ? 'es' : ''} running</span>
            </div>
          )}

          {currentPage !== "processes" && (
            <div className="dropdown dropdown-end">
              <button
                onClick={() => handleAddClick(currentPage)}
                className="btn btn-circle btn-sm"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

            {createMenuOpen && (
              <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-48 p-2 shadow-lg">
                {currentPage === "backups" ? (
                  <>
                    <li>
                      <button
                        onClick={() => handleNewBackup('full')}
                        className="text-sm"
                      >
                        New full backup
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNewBackup('incremental')}
                        className="text-sm"
                      >
                        New incremental backup
                      </button>
                    </li>
                  </>
                ): null}
              </ul>
            )}
            </div>
          )}

          <div className="dropdown dropdown-end">
            <button
              onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
              className="btn btn-ghost btn-sm opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

          {burgerMenuOpen && (
            <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-48 p-2 shadow-lg">
              <li>
                <a href="/dashboard" className="text-sm">Backups</a>
              </li>
              <li>
                <a href="/restores" className="text-sm">Restores</a>
              </li>
              <li>
                <a href="/clients" className="text-sm">Clients</a>
              </li>
              <li>
                <a href="/processes" className="text-sm">Processes</a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm"
                >
                  Log out
                </button>
              </li>
            </ul>
          )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
