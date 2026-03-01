import { getServerURL } from "@/utils/getServerUrl";

const base = getServerURL().replace(/^http/, "ws");

export const socket = new WebSocket(`${base}/recipes/import`);
