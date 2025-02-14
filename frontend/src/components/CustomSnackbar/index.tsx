"use client";

import { useEffect } from "react";

interface CustomSnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function CustomSnackbar({
  message,
  isVisible,
  onClose,
}: CustomSnackbarProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed bottom-5 left-5 p-4 rounded-lg text-white shadow-lg transition-transform duration-500 ease-in-out ${
        isVisible
          ? "translate-x-0 opacity-100 bg-green-600"
          : "-translate-x-full opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
