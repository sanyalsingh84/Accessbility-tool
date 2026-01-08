import React from "react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  children,
}: AlertDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export const AlertDialogHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="mb-4">{children}</div>;
};

export const AlertDialogTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
};

export const AlertDialogDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-sm text-gray-600 mt-2">{children}</p>;
};

export const AlertDialogFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="mt-6 flex justify-end space-x-3">{children}</div>;
};

export const AlertDialogCancel = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
    >
      {children}
    </button>
  );
};

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string; // To allow custom styling like the red background
}

export const AlertDialogAction = ({
  children,
  onClick,
  disabled,
  className,
}: AlertDialogActionProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};
