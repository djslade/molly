import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { URLSearch } from "./components/URLSearch";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const SearchModule = () => {
  return (
    <Tabs defaultValue="url" className="max-w-4xl w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="url">With URL</TabsTrigger>
        <TabsTrigger value="browse">Browse</TabsTrigger>
      </TabsList>
      <TabsContent value="url">
        <URLSearch />
      </TabsContent>
      <TabsContent value="browse">
        <Card>
          <CardTitle>Browse recipes</CardTitle>
          <CardDescription>Now am browsing</CardDescription>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
