type Props = {
  status: "queued" | "running" | "completed" | "failed";
};

const statusStyles = {
  queued: "bg-yellow-100 text-yellow-700",
  running: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }: Props) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
