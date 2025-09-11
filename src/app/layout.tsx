import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
// import GlobalLayout from "./components/layout/globalLayout";
import { ReactQueryProvider } from "./ReactQueryProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard PoliticoZen",
  description: "Create your products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <Theme
            // appearance="dark"
            accentColor="gray"
            grayColor="slate"
            panelBackground="solid"
          > */}
          {children}
          {/* </Theme> */}
        </body>
      </html>
    </ReactQueryProvider>
  );
}
