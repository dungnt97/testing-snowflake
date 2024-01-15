import useTrans from "@/hooks/useTrans";
import { Box, Link } from "@mui/material";
import NextLink from "next/link";
import * as styles from "./styles";

export default function FourOhFourPage() {
  const trans = useTrans();

  return (
    <Box sx={styles.containerBoxStyle}>
      <Box sx={styles.contentBoxStyle}>
        <h1>{trans.error.error_404}</h1>
        <Link href="/" component={NextLink}>
          {trans.error.go_back_home}
        </Link>
      </Box>
    </Box>
  );
}
