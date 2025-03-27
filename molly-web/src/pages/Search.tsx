import { Header } from "@/modules/header/Header";
import { SearchModule } from "@/modules/search/SearchModule";

export const Search = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] p-6 bg-violet-50 flex flex-col items-center">
        <SearchModule />
      </main>
    </>
  );
};
