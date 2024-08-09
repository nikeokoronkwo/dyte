import { encodeHex } from "../../deps.ts";

export async function hash(message) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = encodeHex(hashBuffer);
  return hashHex;
}
