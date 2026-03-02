const websocketConn =
  import.meta.env.VITE_WS_CONN || "ws://localhost:3000/recipes/import";

export const socket = new WebSocket(websocketConn);
