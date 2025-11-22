// src/hooks/useRole.ts
import { useCurrentAccount } from "@mysten/dapp-kit";

export type UserRole = "employer" | "candidate";

// Hard-coded role sets – just to test the app.
// Replace these with real logic later if you want.
const EMPLOYER_ADDRESSES = new Set<string>([
  // lowercase addresses
  "0x111...", // put your own address here
]);

export function useRole(): UserRole | null {
  const account = useCurrentAccount();

  if (!account) return null;

  const addr = account.address.toLowerCase();

  if (EMPLOYER_ADDRESSES.has(addr)) return "employer";

  // everyone else is treated as candidate
  return "candidate";
}