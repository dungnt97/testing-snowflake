import AvatarIcon from "@/assets/icons/avatar.svg";
import { formatAddressDisplay } from "@/utils/formatHelpers";
import { Check } from "@mui/icons-material";
import {
  Box,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { MultisigJob, ProposalStateType } from "@renec-foundation/multisig-sdk";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import IconStep from "./iconStep";
import * as styles from "./styles";

type itemActionProps = {
  address: string;
  nickName?: string;
  time: string;
  done?: boolean;
};

type transactionDetailProps = {
  proposal: MultisigJob;
  approvalsRequired: number;
};

const ItemAction = ({ address, nickName, time, done }: itemActionProps) => (
  <Stack direction="column" spacing={1}>
    <Typography sx={styles.titleItemStyle}>{time}</Typography>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Image src={AvatarIcon} alt="avatar-icon" width={24} height={24} />
        <Stack direction="column" spacing={1}>
          {nickName && (
            <Typography sx={styles.contentItemStyle}>{nickName}</Typography>
          )}
          <Typography sx={styles.contentItemStyle}>
            {formatAddressDisplay(address, 7)}
          </Typography>
        </Stack>
      </Stack>
      {done && (
        <Box sx={styles.iconStepDoneStyle}>
          <Check fontSize="inherit" />
        </Box>
      )}
    </Stack>
  </Stack>
);

const StatusEvent = ({
  proposal,
  approvalsRequired,
}: transactionDetailProps) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    switch (proposal.proposalStage) {
      case ProposalStateType.Pending:
        setActiveStep(1);
        break;
      case ProposalStateType.Approved:
        setActiveStep(3);
        break;
      case ProposalStateType.Complete:
        setActiveStep(4);
        break;
    }
  }, [proposal.proposalStage]);

  return (
    <Stack direction="column" spacing={3}>
      <Typography sx={styles.titleContentStyle}>Status</Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step active={true}>
          <StepLabel icon={<IconStep activeStep={activeStep} index={0} />}>
            <Typography sx={styles.contentTextStyle}>Create</Typography>
          </StepLabel>
          <StepContent>
            <ItemAction
              address={proposal.requestedBy.toString()}
              time={moment.unix(proposal.createdDate).fromNow()}
            />
          </StepContent>
        </Step>
        <Step active={true}>
          <StepLabel icon={<IconStep activeStep={activeStep} index={1} />}>
            <Typography
              sx={styles.contentTextStyle}
            >{`Approved (${proposal.approvals.length}/${approvalsRequired})`}</Typography>
          </StepLabel>
          <StepContent>
            <Stack direction="column" spacing={2}>
              {proposal.approvals.map((approval, index) => (
                <ItemAction
                  key={index}
                  address={approval.owner.toString()}
                  time={moment.unix(approval.date).fromNow()}
                  nickName="hihi"
                  done={approval.isApproved}
                />
              ))}
            </Stack>
          </StepContent>
        </Step>
        <Step active={true}>
          <StepLabel icon={<IconStep activeStep={activeStep} index={2} />}>
            <Typography sx={styles.contentTextStyle}>
              Execution In Progress
            </Typography>
          </StepLabel>
        </Step>
        <Step active={true}>
          <StepLabel icon={<IconStep activeStep={activeStep} index={3} />}>
            <Typography sx={styles.contentTextStyle}>
              Execution successfully
            </Typography>
          </StepLabel>
        </Step>
      </Stepper>
    </Stack>
  );
};

export default StatusEvent;
