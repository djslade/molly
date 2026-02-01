import { SearchModule } from "@/modules/search/SearchModule";

export const Search = () => {
  return (
    <>
      <main className="min-h-[calc(100vh-80px)] py-6 bg-amber-50 flex flex-col items-center px-3">
        <SearchModule />
      </main>
    </>
  );
};
