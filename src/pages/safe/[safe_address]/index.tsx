import { DashboardLayout } from "@/components/layout";
import AssetsPage from "@/components/assets";

const View = ({ safeAddress }: { safeAddress: string }) => {
  return (
    <DashboardLayout withSideBar sideName="Assets" safeAddress={safeAddress}>
      <AssetsPage safeAddress={safeAddress} />
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
