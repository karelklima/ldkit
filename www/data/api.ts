import RAW_API from "../../docs/api.json" with { type: "json" };

export type Api = typeof RAW_API;

export const api: Api = RAW_API;
