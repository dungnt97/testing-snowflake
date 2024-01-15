import { useNProgress } from "@tanem/react-nprogress";
import { Bar } from "./bar";
import { Container } from "./container";

export const ProgressBar = ({ isAnimating }: any) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
};
