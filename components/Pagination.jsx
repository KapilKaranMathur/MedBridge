export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  return (
    <div className="flex gap-3 items-center justify-center">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Prev
      </button>

      <div>Page {page} / {totalPages}</div>

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
