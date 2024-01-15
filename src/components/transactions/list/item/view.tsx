import LaunchIcon from "@/assets/icons/launch.svg";
import SettingsActive from "@/assets/icons/settings-active.svg";
import { formatAddressDisplay } from "@/utils/formatHelpers";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { MultisigJob, ProposalStateType } from "@renec-foundation/multisig-sdk";
import { LAMPORTS_PER_SOL, SystemInstruction } from "@solana/web3.js";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import * as styles from "./styles";

const generateStatus = (stateType: number) => {
  const colorsMapping = {
    [ProposalStateType.Pending.toString()]: ["#efd688", "black", "Pending"],
    [ProposalStateType.Approved.toString()]: ["#00e5ff", "black", "Approved"],
    [ProposalStateType.Rejected.toString()]: ["redLight", "#fff", "Rejected"],
    [ProposalStateType.ExecutionInProgress.toString()]: [
      "orange",
      "#fff",
      "Execution In Progress",
    ],
    [ProposalStateType.Complete.toString()]: ["#133227", "#21D969", "Complete"],
    [ProposalStateType.Failed.toString()]: ["red", "#fff", "Failed"],
    [ProposalStateType.Aborted.toString()]: ["gray", "black", "Aborted"],
    [ProposalStateType.Deprecated.toString()]: [
      "brown",
      "#efd688",
      "Deprecated",
    ],
  };

  const [bgColor, textColor, text] = colorsMapping[stateType.toString()];

  return (
    <Box sx={[styles.statusStyle, { backgroundColor: bgColor }]}>
      <Typography sx={[styles.statusTextStyle, { color: textColor }]}>
        {text}
      </Typography>
    </Box>
  );
};

const generateDate = (createdAt: number) => {
  return new Date(createdAt * 1000).toLocaleString();
};

type transactionItemProps = {
  proposal: MultisigJob;
  safeAddress: string;
  isLast: boolean;
};

const TransactionItem = ({
  safeAddress,
  proposal,
  isLast,
}: transactionItemProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [isTransfer, setIsTransfer] = useState(true);

  useEffect(() => {
    const instructionTransfer = proposal.instructions.find((instruction) => {
      const programId = instruction.programId.toBase58();
      return (
        programId === "SystemProgram" &&
        SystemInstruction.decodeInstructionType(instruction) === "Transfer"
      );
    });

    if (instructionTransfer) {
      const instructionDecode =
        SystemInstruction.decodeTransfer(instructionTransfer);
      setBalance(Number(instructionDecode.lamports) / LAMPORTS_PER_SOL);
    } else {
      setIsTransfer(false);
    }
  }, [proposal.instructions]);

  return (
    <>
      <Link
        href={`/safe/${safeAddress}/transactions/${proposal.pubKey.toString()}`}
        component={NextLink}
        underline="none"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={8}>
            <IconButton onClick={undefined}>
              <Image
                src={isTransfer ? LaunchIcon : SettingsActive}
                alt="download-icon"
                width={32}
                height={32}
              />
            </IconButton>
            <Stack direction="column" spacing={1}>
              <Typography sx={styles.titleTextStyle}>
                {proposal.name}
              </Typography>
              <Typography sx={styles.valueTextStyle}>
                {formatAddressDisplay(proposal.pubKey.toString(), 7)}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="column" spacing={1}>
            <Typography sx={styles.titleTextStyle}>
              {isTransfer ? "Send" : "Change policy"}
            </Typography>
            {isTransfer && (
              <Typography sx={styles.valueTextStyle}>
                {`${balance} RENEC`}
              </Typography>
            )}
          </Stack>
          {generateStatus(proposal.proposalStage)}
          <Typography sx={styles.valueTextStyle}>
            {generateDate(proposal.createdDate)}
          </Typography>
        </Stack>
      </Link>
      {!isLast && <Divider style={{ backgroundColor: "#FFFFFF3D" }} />}
    </>
  );
};

export default TransactionItem;
