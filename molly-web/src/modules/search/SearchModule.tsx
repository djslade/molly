import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { URLSearch } from "./components/URLSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchRecipesResponse } from "@/types/searchRecipesResponse";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";
import { toTitleCase } from "@/utils/toTitleCase";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getServerURL } from "@/utils/getServerUrl";

export const SearchModule = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();

  const handleTabChange = (value: string) => {
    navigate(value, { replace: true });
  };

  const handleNextPage = () => {
    params.set("p", `${parseInt(params.get("p") || "1") + 1}`);
    setParams(params);
    refetch();
  };

  const { isPending, error, data, refetch } = useQuery({
    queryKey: [`recipes`],
    staleTime: 100,
    queryFn: async () => {
      const response = await fetch(
        `${getServerURL()}/recipes?page=${params.get("p") || "1"}`
      );
      const data = await response.json();
      const res: SearchRecipesResponse = {
        total: data.total || 0,
        recipes: data.recipes || [],
      };
      return res;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "Error!" + error.message;

  return (
    <Tabs
      value={pathname === "/" ? "/import" : pathname}
      className="max-w-4xl w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="/import" onClick={() => handleTabChange("/import")}>
          With URL
        </TabsTrigger>
        <TabsTrigger value="/search" onClick={() => handleTabChange("/search")}>
          Browse
        </TabsTrigger>
      </TabsList>
      <TabsContent value="/import">
        <URLSearch />
      </TabsContent>
      <TabsContent value="/search">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Browse recipes</CardTitle>
          </CardHeader>
          <InfiniteScroll
            dataLength={data.recipes.length}
            hasMore={data.total > data.recipes.length}
            next={handleNextPage}
            loader={
              <div className="w-full text-center pt-8">
                <ClipLoader />
              </div>
            }
          >
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.recipes.length === 0 && (
                <CardDescription>There are no results</CardDescription>
              )}
              {data.recipes.map((recipe) => (
                <Card key={recipe.id} className="flex flex-col justify-between">
                  <img
                    src={recipe.image_url}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                  <CardContent>
                    <CardTitle>{toTitleCase(recipe.title || "")}</CardTitle>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="secondary">Add to list</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Coming soon!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
          </InfiniteScroll>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
