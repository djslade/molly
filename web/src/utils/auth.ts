import { FormValidationError } from "@/exceptions/formValidationError";
import { getServerURL } from "./getServerUrl";

interface ResponseBody {
  message: string;
  code: number;
}

const sendPostRequest = async (endpoint: string, body: BodyInit) => {
  return await fetch(endpoint, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
};

export const sendSignupRequest = async (email: string, password: string) => {
  const url = getServerURL();
  const res = await sendPostRequest(
    `${url}/users/signup`,
    JSON.stringify({ email, password })
  );
  const data: ResponseBody = await res.json();
  if (res.status !== 201) {
    throw new FormValidationError({ message: data.message });
  }
};

export const sendLoginRequest = async (email: string, password: string) => {
  const url = getServerURL();
  const res = await sendPostRequest(
    `${url}/users/login`,
    JSON.stringify({ email, password })
  );
  const data: ResponseBody = await res.json();
  if (res.status !== 201) {
    throw new FormValidationError({ message: data.message });
  }
  return data;
};
