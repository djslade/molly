import { ClipLoader } from "react-spinners";

export const Loading = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-amber-50 flex flex-col items-center py-6 px-3">
      <ClipLoader />
    </main>
  );
};
