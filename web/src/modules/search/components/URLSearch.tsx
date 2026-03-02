import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { SocketResponse } from "@/types/socketResponse";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router";

export const URLSearch = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [recipeURL, setRecipeURL] = useState<string>("");

  const changeRecipeURL = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (loading) return;
    setErrorMessage("");
    setRecipeURL(evt.target.value);
  };

  type WSMessage = {
    event: string;
    payload: SocketResponse;
  };

  const handleMessage = (e: MessageEvent) => {
    const msg = JSON.parse(e.data) as WSMessage;

    const value = msg.payload;

    try {
      if (!value.id) {
        throw new Error(value.error || "An unknown error occurred");
      }

      navigate(`/recipe/${value.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (loading || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        event: "scrape.request",
        payload: {
          url: recipeURL,
        },
      }),
    );

    setLoading(true);
  };

  useEffect(() => {
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-6">
        <CardTitle className="text-xl">Search with URL</CardTitle>
        <div className="">
          <div className="flex w-full items-center space-x-2">
            <Input
              disabled={loading}
              type="url"
              placeholder="Recipe URL"
              value={recipeURL}
              onChange={changeRecipeURL}
            />
            <Button
              onClick={onSubmit}
              disabled={loading}
              className="disabled:bg-amber-500"
            >
              {loading ? <ClipLoader size={20} color="#f5f3ff" /> : "Search"}
            </Button>
          </div>
          <span className="text-red-500">{errorMessage}</span>
        </div>
      </CardContent>
    </Card>
  );
};
