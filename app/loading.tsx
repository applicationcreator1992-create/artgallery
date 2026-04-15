"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400"></div>
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-blue-400/20"></div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            Loading...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare your page
          </p>
        </div>
        <div className="flex space-x-2">
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
