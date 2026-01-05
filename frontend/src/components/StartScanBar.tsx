import { useState } from "react";
import { useCreateScan } from "../hooks/useScans";
import { getApiErrorMessage } from "../utils/errors";

const StartScanBar = () => {
  const [url, setUrl] = useState("");
  const { mutate: createScan, isPending, error } = useCreateScan();

  const startScan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;

    createScan(url, {
      onSuccess: () => {
        setUrl(""); // Clear input on success
      },
    });
  };

  const errorMessage = error ? getApiErrorMessage(error) : null;

  return (
    <form
      onSubmit={startScan}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12"
    >
      <div className="flex-1">
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-gray-900 flex-1 px-4 py-2 border-2 rounded-lg border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          aria-label="Website URL to scan"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Starting..." : "Start Scan"}
      </button>
    </form>
  );
};

export default StartScanBar;
