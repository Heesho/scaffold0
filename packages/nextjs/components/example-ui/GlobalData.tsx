import { useAccount } from "wagmi";
import {useScaffoldContractRead} from "~~/hooks/scaffold-eth";
import { formatUnits } from "viem";

export const GlobalData = () => {
  const { address } = useAccount();

  const { data: global } = useScaffoldContractRead({
    contractName: "Multicall",
    functionName: "bondingCurveData",
    args: [address],
  });

  const formattedTvl = global?.tvl !== undefined ? `$${parseFloat(formatUnits(global?.tvl, 18)).toFixed(4)}` : "N/A";
  const formattedMarketCap = global?.marketCap !== undefined ? `$${parseFloat(formatUnits(global?.marketCap, 18)).toFixed(4)}` : "N/A";
  const formattedCirculatingSupply = global?.supplyTOKEN !== undefined ? `${parseFloat(formatUnits(global?.supplyTOKEN, 18)).toFixed(4)} TOKEN` : "N/A";
  const formattedStakedSupply = global?.supplyStaked !== undefined ? `${parseFloat(formatUnits(global?.supplyStaked, 18)).toFixed(4)} TOKEN` : "N/A";
  const formattedLtv = global?.ltv !== undefined ? `${parseFloat(formatUnits(global?.ltv, 18)).toFixed(4)}%` : "N/A";
  const formattedWeekly = global?.weeklyOTOKEN !== undefined ? `${parseFloat(formatUnits(global?.weeklyOTOKEN, 18)).toFixed(4)} oTOKEN` : "N/A";

  return (
    <div className="mx-5 sm:mx-8 2xl:mx-20">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="font-bold">TVL</div>
          <div>{formattedTvl}</div>
        </div>
        <div className="flex flex-col">
          <div className="font-bold">Market Cap</div>
          <div>{formattedMarketCap}</div>
        </div>
        <div className="flex flex-col">
          <div className="font-bold">Circulating Supply</div>
          <div>{formattedCirculatingSupply}</div>
        </div>
        <div className="flex flex-col">
          <div className="font-bold">Staked Supply</div>
          <div>{formattedStakedSupply}</div>
        </div>
        <div className="flex flex-col">
          <div className="font-bold">LTV</div>
          <div>{formattedLtv}</div>
        </div>
        <div className="flex flex-col">
          <div className="font-bold">Weekly Emissions</div>
          <div>{formattedWeekly}</div>
        </div>
      </div>
    </div>
  );
};
