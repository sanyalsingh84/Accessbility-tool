import { AxiosError } from "axios";

// This is a simplified type, you can expand it based on your backend's error responses
type ApiErrorData = {
  message: string;
  stack?: string; // present in development
};

/**
 * Extracts a user-friendly error message from an API error.
 * @param error The error object caught from a try/catch block.
 * @returns A string representing the error message.
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorData;

    // Use the specific message from the API if available
    if (data?.message) {
      return data.message;
    }

    // Fallback for network errors or if the backend sends a plain text response
    if (typeof error.response?.data === "string" && error.response.data) {
      return error.response.data;
    }

    // Fallback to the generic error message from Axios
    return error.message;
  }

  // Fallback for non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};
