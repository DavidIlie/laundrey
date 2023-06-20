"use client";

import React from "react";
import { useHotkeys } from "@mantine/hooks";
import { useTheme } from "next-themes";

const ThemeHotkey: React.FC = () => {
   const { resolvedTheme, setTheme } = useTheme();

   useHotkeys([
      [
         "mod+shift+e",
         () =>
            resolvedTheme === "dark" ? setTheme("light") : setTheme("dark"),
      ],
   ]);
   return <></>;
};

export default ThemeHotkey;
