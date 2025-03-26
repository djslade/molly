import { Button } from "@/components/ui/button";

export const Home = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] p-6 bg-violet-300 flex flex-col justify-center bg-[url('/home.webp')] bg-center bg-no-repeat relative">
      <div className="absolute bg-black inset-0 opacity-60"></div>
      <section className="flex flex-col w-full gap-12 items-center relative">
        <div className="flex flex-col w-full gap-6 text-violet-50">
          <h1 className="text-5xl font-bold text-center">Cooking made easy</h1>
          <h2 className="text-xl text-center">
            Home cooking got you down? Leave it to Molly!
          </h2>
        </div>
        <Button
          variant="default"
          size="lg"
          className="max-w-72 w-full self-center bg-transparent text-amber-50 relative"
        >
          <div className="inset-0 absolute z-10 flex justify-center items-center bg-amber-600 opacity-70 rounded-md"></div>
          <div className="inset-0 absolute z-10 flex justify-center items-center">
            Get started
          </div>
        </Button>
      </section>
    </main>
  );
};
