export const BackupTypeIcon = ({ type }: { type: string }) => {
  const isIncremental = type === 'incremental';
  const title = isIncremental ? 'Incremental' : 'Full';

  return (
    <div className="flex items-center gap-2 group cursor-help">
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="currentColor"
      >
        {isIncremental ? (
          <>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10V2z" />
        </>
        ) : (
          <circle cx="12" cy="12" r="10" />
        )}
      </svg>
      <span className="opacity-0 group-hover:opacity-100 absolute bg-base-200 text-sm px-2 py-1 rounded">
        {title}
      </span>
    </div>
  );
};