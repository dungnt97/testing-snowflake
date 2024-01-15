import FacebookIcon from "@/assets/icons/facebook.svg";
import TelegramIcon from "@/assets/icons/telegram.svg";
import TwitterIcon from "@/assets/icons/twitter.svg";
import { Box } from "@mui/material";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "next-share";
import Image from "next/image";
import { useCallback } from "react";
import * as styles from "./styles";

export type ShareSocialNetworkProps = {
  network: string;
  url: string;
  title: string;
};

const ShareSocialNetwork = ({
  network,
  url,
  title,
}: ShareSocialNetworkProps) => {
  const getNetwork = useCallback(() => {
    switch (network) {
      case "facebook":
        return (
          <Box sx={styles.shareButtonStyle}>
            <FacebookShareButton url={url} quote={title}>
              <Image
                src={FacebookIcon}
                alt="facebook-icon"
                width={20}
                height={20}
              />
            </FacebookShareButton>
          </Box>
        );
      case "twitter":
        return (
          <Box sx={styles.shareButtonStyle}>
            <TwitterShareButton url={url} title={title}>
              <Image
                src={TwitterIcon}
                alt="twitter-icon"
                width={20}
                height={20}
              />
            </TwitterShareButton>
          </Box>
        );
      case "telegram":
        return (
          <Box sx={styles.shareButtonStyle}>
            <TelegramShareButton url={url} title={title}>
              <Image
                src={TelegramIcon}
                alt="telegram-icon"
                width={20}
                height={20}
              />
            </TelegramShareButton>
          </Box>
        );
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  return <Box>{getNetwork()}</Box>;
};

export default ShareSocialNetwork;
