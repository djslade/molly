import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export const NotFound = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] p-6 bg-amber-50 flex flex-col items-center">
      <Card className="max-w-4xl w-full">
        <CardContent className="flex flex-col gap-3  ">
          <CardTitle className="text-xl">Page not found</CardTitle>
          <CardDescription className="text-md">
            Sorry, we couldn't find the page you're looking for.
          </CardDescription>
        </CardContent>
      </Card>
    </main>
  );
};
