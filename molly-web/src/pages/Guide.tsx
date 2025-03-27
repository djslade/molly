import { GuideModule } from "@/modules/guide/GuideModule";
import { Header } from "@/modules/header/Header";

export const Guide = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] p-6 bg-violet-50 flex flex-col items-center">
        <GuideModule />
      </main>
    </>
  );
};
