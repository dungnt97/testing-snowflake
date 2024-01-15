import { TOKEN_PROGRAM_ID } from "@/utils/constants";
import { AnchorProvider } from "@project-serum/anchor";
import { Context, SafeClient } from "@renec-foundation/multisig-sdk";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@renec-foundation/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { ReactNode, createContext, useContext } from "react";

interface multisigContextType {
  safeClient: SafeClient | undefined;
  ctx: Context | undefined;
}

export const MultisigContext = createContext<multisigContextType>({
  safeClient: undefined,
  ctx: undefined,
});

const newAnchorWallet = (publicKey?: PublicKey): AnchorWallet => ({
  publicKey: publicKey || Keypair.generate().publicKey,
  signTransaction: (tx: Transaction | VersionedTransaction) =>
    new Promise(() => tx),
  signAllTransactions: (txs: (Transaction | VersionedTransaction)[]) =>
    new Promise(() => txs),
});

export const MultisigProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const activeWallet = wallet
    ? wallet
    : newAnchorWallet(Keypair.generate().publicKey);

  const provider = new AnchorProvider(
    connection,
    activeWallet,
    AnchorProvider.defaultOptions()
  );
  const ctx = Context.withProvider(provider, TOKEN_PROGRAM_ID);
  const safeClient = new SafeClient(ctx);
  return (
    <MultisigContext.Provider value={{ safeClient, ctx }}>
      {children}
    </MultisigContext.Provider>
  );
};

export const useMultisigContext = () => {
  const context = useContext(MultisigContext);
  return context;
};
