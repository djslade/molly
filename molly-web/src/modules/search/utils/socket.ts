import { getServerURL } from "@/utils/getServerUrl";
import { io } from "socket.io-client";

const URL = getServerURL();

export const socket = io(URL);
