import { Recipe } from "./recipe";

export interface SocketResponse {
  status: string;
  recipe?: Recipe;
}
