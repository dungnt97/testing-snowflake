import EmptyList from "@/components/shared/emptyList";
import Loading from "@/components/shared/loading";
import { formatAddressDisplay } from "@/root/src/utils/formatHelpers";
import { getEndpointExplorerUrl } from "@/utils/constants";
import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useConnection } from "@renec-foundation/wallet-adapter-react";
import { ConfirmedSignatureInfo, PublicKey } from "@solana/web3.js";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import * as styles from "./styles";

export interface executionHistoryProps {
  reReload: number;
  transactionAddress: string;
}

const ExecutionHistory = ({
  reReload,
  transactionAddress,
}: executionHistoryProps) => {
  const { connection } = useConnection();
  const [histories, setHistories] = useState<ConfirmedSignatureInfo[]>([]);
  const [loadingEnable, setLoadingEnable] = useState(true);

  useEffect(() => {
    const fetchExecutionHistory = async () => {
      if (connection) {
        try {
          const his = await connection.getSignaturesForAddress(
            new PublicKey(transactionAddress)
          );
          setHistories(his);
          setLoadingEnable(false);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchExecutionHistory();
  }, [connection, transactionAddress, reReload]);

  return (
    <TableContainer sx={{ backgroundColor: "transparent" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={styles.tableHeaderTextStyle}
              style={{ width: "30%" }}
            >
              Time
            </TableCell>
            <TableCell
              sx={styles.tableHeaderTextStyle}
              style={{ width: "25%" }}
            >
              Status
            </TableCell>
            <TableCell
              sx={styles.tableHeaderTextStyle}
              style={{ width: "45%" }}
            >
              Transaction Signature
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loadingEnable && (
            <TableRow sx={styles.tableRowStyle}>
              <TableCell colSpan={4}>
                <Box sx={styles.flexCenterStyle}>
                  <Loading />
                </Box>
              </TableCell>
            </TableRow>
          )}
          {!loadingEnable && histories.length <= 0 && (
            <TableRow sx={styles.tableRowStyle}>
              <TableCell colSpan={4}>
                <EmptyList
                  height={250}
                  content="You don't have any transactions yet"
                />
              </TableCell>
            </TableRow>
          )}
          {!loadingEnable &&
            histories.length > 0 &&
            histories.map((history, index) => (
              <TableRow key={index}>
                <TableCell sx={styles.tableBodyTextStyle}>
                  {history.blockTime &&
                    new Date(history.blockTime * 1000).toLocaleString()}
                </TableCell>
                <TableCell sx={styles.tableBodyTextStyle}>
                  {history.confirmationStatus}
                </TableCell>
                <TableCell sx={styles.tableBodyTextStyle}>
                  <Link
                    href={getEndpointExplorerUrl(`tx/${history.signature}`)}
                    component={NextLink}
                    target="_blank"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {formatAddressDisplay(history.signature, 15)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExecutionHistory;
