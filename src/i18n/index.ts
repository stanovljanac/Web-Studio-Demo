import { createContext, useContext } from "react";
import { en, type Dict } from "./en";

export type Page = "home" | "privacy";

/* Real URLs of the two pages. */
export const PATHS: Record<Page, string> = { home: "/", privacy: "/privacy/" };

/* Link to a home-page section: a plain hash on the home page,
   the home URL + hash from the privacy page. */
export const sectionHref = (page: Page, id: string) => (page === "home" ? `#${id}` : `${PATHS.home}#${id}`);

type PageState = { page: Page; t: Dict };

export const PageContext = createContext<PageState>({ page: "home", t: en });

export const usePage = () => useContext(PageContext);
export const useT = () => useContext(PageContext).t;
