import ActionSendIcon from "@/assets/icons/action_send.svg";
import RenecIcon from "@/assets/icons/renec.svg";
import { PublicKey } from "@solana/web3.js";

export const MAINNET_RPC_URL = "https://api-mainnet-beta.renec.foundation:8899";
export const TESTNET_RPC_URL = "https://api-testnet.renec.foundation:8899";
export const EXPLORER_URL = "https://explorer.renec.foundation";

export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === "true";
export const E2E_WALLET_PRIVATE_KEY = process.env.NEXT_PUBLIC_E2E_WALLET || "";

export const getRpcEndpointUrl = () =>
  IS_MAINNET ? MAINNET_RPC_URL : TESTNET_RPC_URL;

export const TOKEN_PROGRAM_ID = new PublicKey(
  "SAFEpTn8BzTbrUGyWsPWkQFDKJKthoCXKxPgnbQuZmF"
);

export const TOKEN_PROGRAM_ACCOUNT_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const getEndpointExplorerUrl = (address: string) =>
  `${EXPLORER_URL}/${address}?cluster=${IS_MAINNET ? "mainnet" : "testnet"}`;

// data
export const LIST_ACTIONS = [
  {
    actionName: "Send",
    icon: ActionSendIcon,
  },
];

export const LIST_TOKENS = [
  {
    tokenName: "RENEC",
    icon: RenecIcon,
  },
];

// local storage key
export const KEY_LIST_SAFE = "RESNOW_KEY_LIST_SAFE";
export const KEY_LIST_SAFE_REMOVED = "RESNOW_KEY_LIST_SAFE_REMOVED";
export const KEY_LIST_SAFE_ADDON = "RESNOW_KEY_LIST_SAFE_ADDON";

export const KEY_LIST_CONTACT_SAFE = "RESNOW_KEY_LIST_CONTACT_SAFE";
export const KEY_LIST_OWNER_SAFE = "RESNOW_KEY_LIST_OWNER_SAFE";
