import EmptyList from "@/components/shared/emptyList";
import { Box, Pagination, Stack } from "@mui/material";
import { MultisigJob } from "@renec-foundation/multisig-sdk";
import { useEffect, useState } from "react";
import TransactionItem from "./item";
import * as styles from "./styles";

type transactionsProps = {
  safeAddress: string;
  proposals: MultisigJob[];
};

const PER_PAGE = 10;

const TransactionList = ({ safeAddress, proposals }: transactionsProps) => {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<MultisigJob[]>([]);

  const handleOnChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  useEffect(() => {
    setList(proposals.slice((page - 1) * PER_PAGE, page * PER_PAGE));
  }, [page, proposals]);

  return (
    <>
      {proposals.length > 0 && (
        <Stack direction="column" spacing={3}>
          <Stack sx={styles.boxStyle} direction="column" spacing={3}>
            {list.map((proposal, index, { length }) => (
              <TransactionItem
                key={index}
                safeAddress={safeAddress}
                proposal={proposal}
                isLast={index + 1 === length}
              />
            ))}
          </Stack>
          {proposals.length > PER_PAGE && (
            <Box sx={styles.flexCenterStyle}>
              <Pagination
                sx={styles.paginationCustomStyle}
                size="large"
                count={Math.ceil(proposals.length / PER_PAGE)}
                page={page}
                onChange={handleOnChangePage}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Box>
          )}
        </Stack>
      )}
      {proposals.length <= 0 && (
        <EmptyList height={250} content="You don't have any transactions yet" />
      )}
    </>
  );
};

export default TransactionList;
