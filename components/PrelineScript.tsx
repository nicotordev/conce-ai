"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { IStaticMethods } from "preline/preline";
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}
const isBrowser = typeof window !== undefined; // check if component is rendered in a browser

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    if (isBrowser) {
      // if this component is rendered on a browser, import preline
      import("preline/preline");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isBrowser) {
        // if this component is rendered on a browser, import relevant preline plugins
        import("preline/preline").then(({ HSAccordion, HSDropdown }) => {
          HSAccordion.autoInit();
          HSDropdown.autoInit();
        });
      }
    }, 100);
  }, [path]);

  return <></>;
}
