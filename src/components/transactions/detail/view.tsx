import ActionSendIcon from "@/assets/icons/action_send.svg";
import MinimizeIcon from "@/assets/icons/minimize.svg";
import RenecIcon from "@/assets/icons/renec.svg";
import Loading from "@/components/shared/loading";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { MultisigJob, ProposalStateType } from "@renec-foundation/multisig-sdk";
import { useWallet } from "@renec-foundation/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemInstruction,
} from "@solana/web3.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import ExecutionHistory from "./executionHistory";
import StatusEvent from "./statusEvent";
import * as styles from "./styles";

export interface transactionDetailProps {
  safeAddress: string;
  transactionAddress: string;
}

const TransactionDetail = ({
  safeAddress,
  transactionAddress,
}: transactionDetailProps) => {
  const { publicKey } = useWallet();
  const { safeClient } = useMultisigContext();
  const [proposal, setProposal] = useState<MultisigJob | undefined>();
  const [balance, setBalance] = useState<number>(0);
  const [addressReceiver, setAddressReceiver] = useState<string>("");
  const [loadingEnable, setLoadingEnable] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [showExecuted, setShowExecuted] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [reReload, setReReload] = useState(0);
  const [approvalsRequired, setApprovalsRequired] = useState(0);

  useEffect(() => {
    const fetchProposal = async () => {
      if (safeClient) {
        try {
          setShowApproval(false);
          setShowExecuted(false);
          const safe = await safeClient.fetcher.findSafe(
            new PublicKey(safeAddress)
          );
          const getProposal = await safeClient.fetchProposal(
            new PublicKey(transactionAddress)
          );
          setShowDelete(
            getProposal.proposalStage !== ProposalStateType.Complete
          );
          const instructionTransfer = getProposal.instructions.find(
            (instruction) =>
              SystemInstruction.decodeInstructionType(instruction) ===
              "Transfer"
          );
          if (instructionTransfer) {
            const instructionDecode =
              SystemInstruction.decodeTransfer(instructionTransfer);
            setBalance(Number(instructionDecode.lamports) / LAMPORTS_PER_SOL);
            setAddressReceiver(instructionDecode.toPubkey.toString());
          }
          const canManager = safe.owners.find(
            (o) => o.toString() === publicKey?.toString()
          );
          const approved = getProposal.approvals.find(
            (approval) => approval.owner.toString() === publicKey?.toString()
          );
          if (
            canManager &&
            getProposal.proposalStage === ProposalStateType.Pending &&
            !approved
          ) {
            setShowApproval(true);
          }
          if (
            canManager &&
            getProposal.proposalStage === ProposalStateType.Approved
          ) {
            setShowExecuted(true);
          }
          setApprovalsRequired(safe.approvalsRequired);
          setProposal(getProposal);
          setLoadingEnable(false);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchProposal();
  }, [publicKey, safeAddress, safeClient, transactionAddress]);

  const handleClickDelete = async () => {
    if (safeClient && proposal) {
      try {
        setLoadingAction(true);
        const rejectTx = await safeClient.rejectProposal(proposal?.pubKey);
        await rejectTx.buildAndExecute();

        setLoadingAction(false);
        setReReload(reReload + 1);
      } catch (error) {
        console.error(error);
        setLoadingAction(false);
      }
    }
  };

  const handleClickApproval = async () => {
    if (safeClient && proposal) {
      try {
        setLoadingAction(true);
        const transaction = await safeClient.approveProposal(proposal.pubKey);
        await transaction.buildAndExecute();

        setLoadingAction(false);
        setReReload(reReload + 1);
      } catch (error) {
        console.error(error);
        setLoadingAction(false);
      }
    }
  };

  const handleClickExecute = async () => {
    if (safeClient && proposal) {
      try {
        setLoadingAction(true);
        const executeTx = await safeClient.executeProposal(proposal.pubKey);
        await executeTx.buildAndExecute();

        setLoadingAction(false);
        setReReload(reReload + 1);
      } catch (error) {
        console.error(error);
        setLoadingAction(false);
      }
    }
  };

  return (
    <Box sx={styles.main}>
      {loadingEnable && (
        <Box sx={[styles.boxStyle, styles.flexCenterStyle]}>
          <Loading />
        </Box>
      )}
      {!loadingEnable && proposal && (
        <Stack direction="column" spacing={5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={styles.titleLabelStyle}>{proposal.name}</Typography>
            <Stack direction="row" spacing={2}>
              {showDelete && (
                <Button
                  variant="outlined"
                  sx={styles.btnCancelStyle}
                  onClick={handleClickDelete}
                  disabled={loadingAction}
                >
                  {loadingAction && <Loading />}
                  {!loadingAction && (
                    <Typography sx={styles.deleteTextStyle}>Delete</Typography>
                  )}
                </Button>
              )}
              {showApproval && (
                <Button
                  variant="contained"
                  sx={styles.btnStyle}
                  onClick={handleClickApproval}
                  disabled={loadingAction}
                >
                  {loadingAction && <Loading />}
                  {!loadingAction && (
                    <Typography sx={styles.textBtnStyle}>Approval</Typography>
                  )}
                </Button>
              )}
              {showExecuted && (
                <Button
                  variant="contained"
                  sx={styles.btnStyle}
                  onClick={handleClickExecute}
                  disabled={loadingAction}
                >
                  {loadingAction && <Loading />}
                  {!loadingAction && (
                    <Typography sx={styles.textBtnStyle}>Execute</Typography>
                  )}
                </Button>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={4} justifyContent="space-between">
            <Stack flex={3} direction="column" spacing={3}>
              <Stack direction="column" spacing={2} sx={styles.boxStyle}>
                <Stack direction="row" spacing={2}>
                  <Image
                    src={MinimizeIcon}
                    alt="minimize-icon"
                    width={32}
                    height={32}
                  />
                  <Typography sx={styles.titleContentStyle}>Action</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={8}>
                  <Typography flex={1} sx={styles.contentTextStyle}>
                    Action type:
                  </Typography>
                  <Box flex={6} sx={styles.boxFieldStyle}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Image
                        src={ActionSendIcon}
                        alt="minimize-icon"
                        width={24}
                        height={24}
                      />
                      <Typography sx={{ color: "#888C9E" }}>
                        Send Action
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                <Box sx={{ py: 5 }}>
                  <Divider style={{ backgroundColor: "#FFFFFF3D" }} />
                </Box>
                <Stack direction="row" alignItems="center" spacing={8}>
                  <Typography flex={1} sx={styles.contentTextStyle}>
                    Amount:
                  </Typography>
                  <Stack flex={6} direction="row" spacing={2}>
                    <Box flex={1} sx={styles.boxFieldStyle}>
                      <Typography sx={{ color: "#888C9E" }}>
                        {balance}
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={2}
                      flex={1}
                      sx={styles.boxFieldStyle}
                    >
                      <Image
                        src={RenecIcon}
                        alt="minimize-icon"
                        width={24}
                        height={24}
                      />
                      <Typography sx={{ color: "#888C9E" }}>RENEC</Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={8}>
                  <Typography flex={1} sx={styles.contentTextStyle}>
                    Send to:
                  </Typography>
                  <Stack flex={6} direction="row" spacing={2}>
                    <Box flex={1} sx={styles.boxFieldStyle}>
                      <Typography sx={{ color: "#888C9E" }}>
                        {addressReceiver}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      sx={styles.btnAddContactStyle}
                      onClick={undefined}
                    >
                      <Typography sx={styles.deleteTextStyle}>
                        Add contact
                      </Typography>
                    </Button>
                  </Stack>
                </Stack>
              </Stack>

              <Stack direction="column" spacing={4} sx={styles.boxStyle}>
                <Stack direction="row" spacing={2}>
                  <Image
                    src={MinimizeIcon}
                    alt="minimize-icon"
                    width={32}
                    height={32}
                  />
                  <Typography sx={styles.titleContentStyle}>
                    Execution History
                  </Typography>
                </Stack>

                <ExecutionHistory
                  reReload={reReload}
                  transactionAddress={transactionAddress}
                />
              </Stack>
            </Stack>
            <Box flex={1} sx={styles.boxStatusStyle}>
              <StatusEvent
                proposal={proposal}
                approvalsRequired={approvalsRequired}
              />
            </Box>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default TransactionDetail;
