import { Link, useLocation } from "react-router-dom";
import { Flex, Box } from "@radix-ui/themes";
import { ConnectButton } from "@mysten/dapp-kit";

export function NavBar() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <Flex
      px="4"
      py="3"
      align="center"
      justify="between"
      style={{
        borderBottom: "1px solid var(--gray-a2)",
        background: "var(--color-background)",
      }}
    >
      <Box>
        <h3 style={{ margin: 0 }}>Navigation</h3>
      </Box>

      <Flex gap="3" align="center">
        <Link to="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              background: current === "/" ? "#4d65ff" : "#333",
              border: "none",
              color: "white",
            }}
          >
            Home
          </button>
        </Link>

        <Link to="/me" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              background: current === "/me" ? "#4d65ff" : "#333",
              border: "none",
              color: "white",
            }}
          >
            Me
          </button>
        </Link>

        <ConnectButton />
      </Flex>
    </Flex>
  );
}