// src/networkConfig.ts
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

// === REAL DEPLOYED VALUES (SHA256 PROTECTED) ===
const PACKAGE_ID =
  "0x31df1e5a75d56e5af0bc4c7a57dddf6c244f6f76dc624a0028d8db1cfb672a1a";

const JOB_BOARD_ID =
  "0xb2ecc04c971c8176498253f2eb41db3fcc731272745c9a0de4ea10c33505cc12";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: PACKAGE_ID,
        jobBoardId: JOB_BOARD_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: PACKAGE_ID,
        jobBoardId: JOB_BOARD_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: PACKAGE_ID,
        jobBoardId: JOB_BOARD_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };