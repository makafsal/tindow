import { StrictMode, useState } from "react";
import App from "./App.tsx";
import { Theme } from "@carbon/react";
import type { ThemeType } from "./types.ts";

export function Root() {
  const [theme, setTheme] = useState<ThemeType>("g100");

  return (
    <StrictMode>
      <Theme theme={theme}>
        <App onThemeChange={setTheme} />
      </Theme>
    </StrictMode>
  );
}
