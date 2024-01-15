import EmptyList from "@/components/shared/emptyList";
import useLocalStorage from "@/hooks/useLocalStorage";
import { KEY_LIST_SAFE } from "@/utils/constants";
import { faker } from "@faker-js/faker";
import { Stack } from "@mui/material";
import { SafeType } from "@renec-foundation/multisig-sdk";
import { PublicKey } from "@solana/web3.js";
import ItemSafe from "./ItemSafe";
import ItemSafeAddon from "./ItemSafeAddon";

type listSafeProps = {
  publicKey: PublicKey | null;
  safes: SafeType[];
  listSafeAddon: string[];
  handleRemoveSafe: (safeAddress: string) => void;
  handleRemoveAddonSafe: (safeAddress: string) => void;
};

const ListSafe = ({
  safes,
  listSafeAddon,
  publicKey,
  handleRemoveSafe,
  handleRemoveAddonSafe,
}: listSafeProps) => {
  const [cacheListSafe, setCacheListSafe] = useLocalStorage(
    KEY_LIST_SAFE,
    {} as any
  );

  if (safes.length < 1 && listSafeAddon.length < 1) {
    return <EmptyList />;
  }

  return (
    <Stack direction="column" spacing={4}>
      {safes
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((safe, index) => (
          <ItemSafe
            key={index}
            nickName={
              cacheListSafe[safe.safeAddress.toString()] ||
              faker.commerce.productName().toLowerCase()
            }
            safe={safe}
            publicKey={publicKey}
            handleRemoveSafe={handleRemoveSafe}
          />
        ))}
      {listSafeAddon.map((safeAddress, index) => (
        <ItemSafeAddon
          key={index}
          nickName={
            cacheListSafe[safeAddress] ||
            faker.commerce.productName().toLowerCase()
          }
          safeAddress={safeAddress}
          publicKey={publicKey}
          handleRemoveSafe={handleRemoveAddonSafe}
        />
      ))}
    </Stack>
  );
};

export default ListSafe;
