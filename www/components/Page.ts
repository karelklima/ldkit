import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface PageInfo {
  /** URL path of the page being rendered. */
  path: string;
  /** URL of the site stylesheet (hashed in production builds). */
  stylesheet: string;
}

export const PageContext = createContext<PageInfo>({
  path: "/",
  stylesheet: "/styles/site.css",
});

export function usePage(): PageInfo {
  return useContext(PageContext);
}
