import DownloadIcon from "@/assets/icons/download.svg";
import Loading from "@/components/shared/loading";
import { useMultisigContext } from "@/components/shared/multisigProvider";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { MultisigJob, ProposalStateType } from "@renec-foundation/multisig-sdk";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import { transactionsProps } from "./common";
import TransactionList from "./list";
import * as styles from "./styles";

export const tabs = ["Queue", "In Execution", "History"];

const Transactions = ({ safeAddress }: transactionsProps) => {
  const [valueTab, setValueTab] = useState(0);
  const { safeClient } = useMultisigContext();
  const [queueProposals, setQueueProposals] = useState<MultisigJob[]>([]);
  const [inExecutionProposals, setInExecutionProposals] = useState<
    MultisigJob[]
  >([]);
  const [histories, setHistories] = useState<MultisigJob[]>([]);
  const [loadingEnable, setLoadingEnable] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (safeClient) {
        const allProposals = await safeClient.fetchAllProposals(
          new PublicKey(safeAddress)
        );
        const queues: SetStateAction<MultisigJob[]> = [];
        const executions: SetStateAction<MultisigJob[]> = [];
        const his: SetStateAction<MultisigJob[]> = [];
        allProposals.forEach((pro) => {
          if (
            pro.proposalStage === ProposalStateType.Pending ||
            pro.proposalStage === ProposalStateType.Approved
          ) {
            queues.push(pro);
          } else if (
            pro.proposalStage === ProposalStateType.ExecutionInProgress
          ) {
            executions.push(pro);
          } else {
            his.push(pro);
          }
        });
        setQueueProposals(queues);
        setInExecutionProposals(executions);
        setHistories(his);
        setLoadingEnable(false);
      }
    };

    fetchProposals();
  }, [safeAddress, safeClient]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const generateCount = (index: number) => {
    if (index === 0) {
      return queueProposals.length;
    } else if (index === 1) {
      return inExecutionProposals.length;
    } else {
      return histories.length;
    }
  };

  return (
    <Box sx={styles.main}>
      <Stack direction="column" spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={styles.titleLabelStyle}>Transactions</Typography>
          <IconButton sx={styles.btnDownloadStyle} onClick={undefined}>
            <Image
              src={DownloadIcon}
              alt="download-icon"
              width={32}
              height={32}
            />
          </IconButton>
        </Stack>
        <Box>
          <Tabs
            value={valueTab}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="primary"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                value={index}
                label={`${tab} (${generateCount(index)})`}
              />
            ))}
          </Tabs>
          <Divider style={{ backgroundColor: "#383B54" }} />
        </Box>
        <Stack direction="column" spacing={3}>
          {loadingEnable && (
            <Box sx={[styles.boxStyle, styles.flexCenterStyle]}>
              <Loading />
            </Box>
          )}
          {!loadingEnable && (
            <TransactionList
              safeAddress={safeAddress}
              proposals={
                valueTab === 0
                  ? queueProposals
                  : valueTab === 1
                  ? inExecutionProposals
                  : histories
              }
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Transactions;
