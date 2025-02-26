import { useState } from "react";

export const Header = () => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
  };

  const handleNewBackup = (type: 'full' | 'incremental') => {
    console.log('Creating new', type, 'backup');
    setCreateMenuOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-6 mt-8">
        <h1 className="text-3xl font-bold text-primary">Backups</h1>
      </div>
      <div className="flex flex-col items-end gap-2">
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

        <div className="dropdown dropdown-end">
          <button
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
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
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};