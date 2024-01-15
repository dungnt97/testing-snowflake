import { DashboardLayout } from "@/components/layout";
import Transactions from "@/components/transactions";

const View = ({ safeAddress }: { safeAddress: string }) => {
  return (
    <DashboardLayout
      withSideBar
      sideName="Transactions"
      safeAddress={safeAddress}
    >
      <Transactions safeAddress={safeAddress} />
    </DashboardLayout>
  );
};

export default View;

export const getServerSideProps = async (context: {
  locale: string;
  query: { safe_address: string };
}) => {
  return {
    props: {
      safeAddress: context.query.safe_address,
    },
  };
};
