import { ownerData, safeData } from "@/utils/dataTypes";

export interface newSafeProps {
  openModalNewSafe: boolean;
  handleCloseModal: () => void;
  handleIncrementRefreshCount: () => void;
}

export interface iconStepProps {
  activeStep: number;
  index: number;
}

export interface safeDetailStepProps {
  safeName: string;
  errorSafeName?: boolean;
  handleChangeSafeName: (value: string) => void;
}

export interface safeOwnersStepProps {
  currentOwners: ownerData[];
  currentNumberRequireApprove: number;
  handleAddMoreAccount: () => void;
  handleChangeOwnersData: (index: number, newOwner: ownerData) => void;
  handleRemoveOwner: (index: number) => void;
  handleChangeNumberRequireApprove: (numberRequireApprove: number) => void;
  errorNumberRequire?: boolean;
}

export interface safeReviewStepProps {
  data: safeData;
}

export interface ownerRowProps {
  index: number;
  currentOwner: ownerData;
  handleRemove: () => void;
  setCurrentOwner: (index: number, owner: ownerData) => void;
}
