import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Montserrat, Roboto_Mono } from "next/font/google";

import { theme } from "../theme";
import { QueryProvider } from "./QueryProvider";

const montserrat = Montserrat({ subsets: ["latin-ext", "latin"] });
const roboto_mono = Roboto_Mono({
  subsets: ["latin-ext", "latin"],
});

export const metadata = {
  title: "Box Beat",
  description: "Box Beat - Box with the beat!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ height: "100%" }}>
        <QueryProvider>
          <MantineProvider
            theme={{
              ...theme,
              fontFamily: montserrat.style.fontFamily,
              fontFamilyMonospace: roboto_mono.style.fontFamily,
            }}
          >
            {/* <AnimatedBackgrounds /> */}
            {children}
          </MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
