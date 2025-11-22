// src/App.tsx
import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex } from "@radix-ui/themes";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { NavBar } from "./components/NavBar";
import HomePage from "./pages/HomePage";
import MePage from "./pages/MePage";

// Layout that lives INSIDE Router
function Layout() {
  return (
    <Flex direction="column" style={{ minHeight: "100vh" }}>
      {/* Top Bar */}
      <Flex
        px="4"
        py="3"
        justify="between"
        align="center"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          background: "var(--color-background)",
        }}
      >
        <Box>
          <h2 style={{ margin: 0 }}>Suinder</h2>
        </Box>

        <ConnectButton />
      </Flex>

      {/* Nav bar - NOW inside Router */}
      <NavBar />

      {/* Page content */}
      <Box style={{ flexGrow: 1, padding: "24px" }}>
        <Outlet />
      </Box>
    </Flex>
  );
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,     // layout wraps all pages
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/me", element: <MePage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}