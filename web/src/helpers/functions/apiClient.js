
import { createDirectus, rest } from "@directus/sdk";

let clientInstance = null;

export default function apiClient(){
  if (!clientInstance) {
    clientInstance = createDirectus(process.env.DIRECTUS_URL, {
      fetchOptions: {
        mode: "cors",
        headers: process.env.DIRECTUS_TOKEN
          ? {
              Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
            }
          : {},
      },
    }).with(rest());
  }
  return clientInstance;
};
