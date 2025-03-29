import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { URLSearch } from "./components/URLSearch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchRecipesResponse } from "@/types/searchRecipesResponse";
import { Link, useSearchParams } from "react-router";

export const SearchModule = () => {
  const [params, setParams] = useSearchParams();

  const { isPending, error, data } = useQuery({
    queryKey: [`recipes`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/recipes`);
      const data = await response.json();
      return data as SearchRecipesResponse;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "Error!" + error.message;

  return (
    <Tabs defaultValue="url" className="max-w-4xl w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="import">With URL</TabsTrigger>
        <TabsTrigger value="browse">Browse</TabsTrigger>
      </TabsList>
      <TabsContent value="import">
        <URLSearch />
      </TabsContent>
      <TabsContent value="browse">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Browse recipes</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {data.recipes.map((recipe) => (
              <Card key={recipe.id} className="flex flex-col justify-between">
                <img
                  src={recipe.image_url}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
                <CardContent>
                  <CardTitle>{recipe.title}</CardTitle>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="secondary">Add to list</Button>
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    See more
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
