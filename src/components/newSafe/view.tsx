import Loading from "@/components/shared/loading";
import useLocalStorage from "@/hooks/useLocalStorage";
import { KEY_LIST_SAFE } from "@/utils/constants";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { newSafeProps } from "./common";
import IconStep from "./iconStep/view";
import StepDetail from "./stepDetail";
import StepOwners from "./stepOwners/view";
import StepReview from "./stepReview";
import * as styles from "./styles";
import { NewSafeStep, steps, useNewSafeState } from "./useCreateSafeState";

const newSafe = ({
  openModalNewSafe,
  handleCloseModal,
  handleIncrementRefreshCount,
}: newSafeProps) => {
  const [cacheListSafe, setCacheListSafe] = useLocalStorage(
    KEY_LIST_SAFE,
    {} as any
  );
  const {
    activeStep,
    data,
    loading,
    errorSafeName,
    errorNumberRequire,
    setActiveStep,
    handleChangeSafeName,
    handleAddMoreAccount,
    handleChangeOwnersData,
    handleRemoveOwner,
    handleChangeNumberRequireApprove,
    handleCreateNewSafe,
  } = useNewSafeState();

  const handleContinueAndCreate = async () => {
    switch (activeStep) {
      case NewSafeStep.DETAIL:
        setActiveStep(NewSafeStep.OWNERS);
        break;
      case NewSafeStep.OWNERS:
        setActiveStep(NewSafeStep.REVIEW);
        break;
      case NewSafeStep.REVIEW: {
        const result = await handleCreateNewSafe();
        if (result.created) {
          if (result.safeAddress) {
            setCacheListSafe({
              ...cacheListSafe,
              [result.safeAddress]: data.name,
            });
          }
          handleCloseModal();
          handleIncrementRefreshCount();
        }
        break;
      }
      default:
        break;
    }
  };

  const handleBackOrCancel = () => {
    switch (activeStep) {
      case NewSafeStep.DETAIL:
        handleCloseModal();
        break;
      case NewSafeStep.OWNERS:
        setActiveStep(NewSafeStep.DETAIL);
        break;
      case NewSafeStep.REVIEW:
        setActiveStep(NewSafeStep.OWNERS);
        break;
      default:
        break;
    }
  };

  const shouldDisableButton = (): boolean => {
    switch (activeStep) {
      case NewSafeStep.DETAIL:
        return !data.name;
      case NewSafeStep.OWNERS:
        if (errorNumberRequire) {
          return true;
        }
        return data.owners.some((owner) => !owner.ownerAddress);
      default:
        return false;
    }
  };

  return (
    <Modal open={openModalNewSafe} onClose={handleCloseModal}>
      <Box sx={styles.modalStyle}>
        <Box sx={styles.headerModalStyle}>
          <Typography sx={styles.textTitleStyle}>
            {"Create a new safe"}
          </Typography>
          <IconButton sx={styles.textTitleStyle} onClick={handleCloseModal}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={styles.bodyModalStyle}>
          <Stack sx={{ py: 2, px: 4 }} spacing={4}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                return (
                  <Step key={index}>
                    <StepLabel
                      icon={<IconStep activeStep={activeStep} index={index} />}
                    >
                      {
                        <Typography
                          sx={
                            activeStep >= index
                              ? styles.labelActiveStepTextStyle
                              : styles.labelStepTextStyle
                          }
                        >
                          {label}
                        </Typography>
                      }
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === NewSafeStep.DETAIL && (
              <StepDetail
                safeName={data.name}
                errorSafeName={errorSafeName}
                handleChangeSafeName={handleChangeSafeName}
              />
            )}
            {activeStep === NewSafeStep.OWNERS && (
              <StepOwners
                currentOwners={data.owners}
                currentNumberRequireApprove={data.numberRequireApprove}
                handleAddMoreAccount={handleAddMoreAccount}
                handleChangeOwnersData={handleChangeOwnersData}
                handleRemoveOwner={handleRemoveOwner}
                handleChangeNumberRequireApprove={
                  handleChangeNumberRequireApprove
                }
                errorNumberRequire={errorNumberRequire}
              />
            )}
            {activeStep === NewSafeStep.REVIEW && <StepReview data={data} />}
          </Stack>
        </Box>
        <Box sx={styles.footerModalStyle}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              sx={styles.btnCancelStyle}
              onClick={handleBackOrCancel}
              disabled={loading}
            >
              <Typography sx={styles.cancelTextStyle}>
                {activeStep === NewSafeStep.DETAIL ? "Cancel" : "Back"}
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={styles.btnStyle}
              onClick={handleContinueAndCreate}
              disabled={loading || shouldDisableButton()}
            >
              {loading && <Loading />}
              {!loading && (
                <Typography sx={styles.textBtnStyle}>
                  {activeStep === NewSafeStep.REVIEW ? "Create" : "Continue"}
                </Typography>
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default newSafe;
