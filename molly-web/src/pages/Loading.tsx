import { ClipLoader } from "react-spinners";

export const Loading = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] p-6 bg-amber-50 flex flex-col items-center">
      <ClipLoader />
    </main>
  );
};
