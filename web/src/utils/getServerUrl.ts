export const getServerURL = () => {
  return import.meta.env.VITE_SERVER_CONN || "http://localhost:3000";
};
