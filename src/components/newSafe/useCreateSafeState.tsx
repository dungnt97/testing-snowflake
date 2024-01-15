import { useMultisigContext } from "@/components/shared/multisigProvider";
import {
  defaultOwnerData,
  defaultSafeData,
  ownerData,
  safeData,
} from "@/utils/dataTypes";
import { SafeClient } from "@renec-foundation/multisig-sdk";
import { useWallet } from "@renec-foundation/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";

export const steps = ["Safe detail", "Add owners", "Review"];

export enum NewSafeStep {
  DETAIL = 0,
  OWNERS = 1,
  REVIEW = 2,
}

export const useNewSafeState = () => {
  const { publicKey } = useWallet();
  const [data, setData] = useState<safeData>(
    defaultSafeData(publicKey?.toString() || "")
  );
  const [activeStep, setActiveStep] = useState<NewSafeStep>(NewSafeStep.DETAIL);
  const [loading, setLoading] = useState(false);
  const { ctx } = useMultisigContext();

  // errors
  const [errorSafeName, setErrorSafeName] = useState<boolean>(false);
  const [errorNumberRequire, setErrorNumberRequire] = useState<boolean>(false);

  const handleChangeSafeName = (name: string) => {
    setErrorSafeName(name === "");
    setData({ ...data, name });
  };

  const handleAddMoreAccount = () => {
    const newOwners = [...data.owners, defaultOwnerData];
    setData({ ...data, owners: newOwners });
  };

  const handleChangeOwnersData = (index: number, newOwner: ownerData) => {
    const newOwners = data.owners.map((owner, i) => {
      if (index === i) {
        return newOwner;
      }
      return owner;
    });

    setData({ ...data, owners: newOwners });
  };

  const handleRemoveOwner = (indexToRemove: number) => {
    const newOwners = data.owners.filter((_, index) => index !== indexToRemove);

    setData({ ...data, owners: newOwners });
  };

  const handleChangeNumberRequireApprove = (value: number) => {
    setErrorNumberRequire(value < 1 || value > data.owners.length);
    setData({ ...data, numberRequireApprove: value });
  };

  const detectSafeAddress = (transaction: any) => {
    try {
      return transaction.instructions[0].instructions[0].keys
        .find(
          (key: {
            isWritable: any;
            isSigner: any;
            pubkey: { toString: () => string | undefined };
          }) =>
            key.isWritable &&
            key.isSigner &&
            key.pubkey.toString() !== publicKey?.toString()
        )
        .pubkey.toString();
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const handleCreateNewSafe = async () => {
    setLoading(true);
    try {
      if (ctx) {
        const owners = data.owners.map((o) => {
          return new PublicKey(o.ownerAddress);
        });
        const transaction = await SafeClient.create(
          ctx,
          owners,
          data.numberRequireApprove
        );
        await transaction.buildAndExecute();
        const tempSafeAddress = detectSafeAddress(transaction);
        setData(defaultSafeData(publicKey?.toString() || ""));
        setActiveStep(NewSafeStep.DETAIL);

        return {
          created: true,
          error: "",
          safeAddress: tempSafeAddress,
        };
      } else {
        return {
          created: false,
          error: "Ctx not found",
        };
      }
    } catch (error) {
      console.error("Create Safe: ", error);
      return {
        created: false,
        error,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    // data
    data,
    activeStep,
    loading,

    // errors
    errorSafeName,
    errorNumberRequire,

    // functions
    setActiveStep,
    handleChangeSafeName,
    handleAddMoreAccount,
    handleChangeOwnersData,
    handleRemoveOwner,
    handleChangeNumberRequireApprove,
    handleCreateNewSafe,
  };
};
