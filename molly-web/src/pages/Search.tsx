import { SearchModule } from "@/modules/search/SearchModule";

export const Search = () => {
  return (
    <>
      <main className="min-h-[calc(100vh-80px)] p-6 bg-amber-50 flex flex-col items-center">
        <SearchModule />
      </main>
    </>
  );
};
