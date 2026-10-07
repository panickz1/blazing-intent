import localFont from "next/font/local";

export const sans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../assets/fonts/OpenSauceTwo-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/OpenSauceTwo-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/OpenSauceTwo-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/OpenSauceTwo-Bold.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/OpenSauceTwo-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../assets/fonts/OpenSauceTwo-Black.woff2", weight: "900", style: "normal" },
  ],
});

export const heading = sans;
