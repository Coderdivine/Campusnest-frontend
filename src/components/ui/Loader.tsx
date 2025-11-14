'use client';

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
