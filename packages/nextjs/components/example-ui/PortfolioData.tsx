import { useAccount } from "wagmi";
import {useScaffoldContractRead} from "~~/hooks/scaffold-eth";
import { formatUnits } from "viem";

export const PortfolioData = () => {
  const { address } = useAccount();

  const { data: portfolio } = useScaffoldContractRead({
    contractName: "Multicall",
    functionName: "portfolioData",
    args: [address],
  });

  const formattedTotal = portfolio?.total !== undefined ? `$${parseFloat(formatUnits(portfolio?.total, 18)).toFixed(4)}` : "N/A";
  const formattedStakingRewards = portfolio?.stakingRewards !== undefined ? `$${parseFloat(formatUnits(portfolio?.stakingRewards, 18)).toFixed(4)}/week` : "N/A";
  const formattedGridRewards = portfolio?.gridRewards !== undefined ? `$${parseFloat(formatUnits(portfolio?.gridRewards, 18)).toFixed(4)}/week` : "N/A";

  return (
    <div className="flex flex-col w-full p-4 border rounded overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
      <div className="flex justify-between">
        <span className="font-semibold">Total:</span>
        <span>{formattedTotal}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Staking Rewards:</span>
        <span>{formattedStakingRewards}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Grid Rewards:</span>
        <span>{formattedGridRewards}</span>
      </div>
    </div>
  );
};
