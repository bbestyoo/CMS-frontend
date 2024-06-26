import { Inter } from "next/font/google";
import "../styles/globals.css";
import StoreProvider from "./storeProvider";
import UserProvider from "./userProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ezilogs Inc.",
  description: "Created by Sir.Bibesh Basnet",
};

export default function RootLayout({ children }) {


    return (
    <html lang="en">

      
      <body className={inter.className}>
    <StoreProvider>
      <UserProvider>
        {children}
      </UserProvider>
        </StoreProvider>

        </body>
    </html>
  );
}
