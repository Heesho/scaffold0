import { useAccount } from "wagmi";
import {useScaffoldContractRead} from "~~/hooks/scaffold-eth";
import { formatUnits } from "viem";

export const UserData = () => {
  const { address } = useAccount();

  const { data: user } = useScaffoldContractRead({
    contractName: "Multicall",
    functionName: "bondingCurveData",
    args: [address],
  });

  const apr = user?.apr !== undefined ? `${parseFloat(formatUnits(user?.apr, 18)).toFixed(4)}%` : "N/A";
  const accountBase = user?.accountBASE !== undefined ? `${parseFloat(formatUnits(user?.accountBASE, 18)).toFixed(4)}` : "N/A";
  const accountToken = user?.accountTOKEN !== undefined ? `${parseFloat(formatUnits(user?.accountTOKEN, 18)).toFixed(4)}` : "N/A";
  const accountOToken = user?.accountOTOKEN !== undefined ? `${parseFloat(formatUnits(user?.accountOTOKEN, 18)).toFixed(4)}` : "N/A";
  const accountBaseEarned = user?.accountEarnedBASE !== undefined ? `${parseFloat(formatUnits(user?.accountEarnedBASE, 18)).toFixed(4)}` : "N/A";
  const accountTokenEarned = user?.accountEarnedTOKEN !== undefined ? `${parseFloat(formatUnits(user?.accountEarnedTOKEN, 18)).toFixed(4)}` : "N/A";
  const accountOTokenEarned = user?.accountEarnedOTOKEN !== undefined ? `${parseFloat(formatUnits(user?.accountEarnedOTOKEN, 18)).toFixed(4)}` : "N/A";
  const accountStaked = user?.accountStaked !== undefined ? `${parseFloat(formatUnits(user?.accountStaked, 18)).toFixed(4)}` : "N/A";
  const accountPower = user?.accountPower !== undefined ? `${parseFloat(formatUnits(user?.accountPower, 18)).toFixed(4)}` : "N/A";
  const accountBorrowCredit = user?.accountBorrowCredit !== undefined ? `${parseFloat(formatUnits(user?.accountBorrowCredit, 18)).toFixed(4)}` : "N/A";
  const accountBorrowDebt = user?.accountBorrowDebt !== undefined ? `${parseFloat(formatUnits(user?.accountBorrowDebt, 18)).toFixed(4)}` : "N/A";

  return (
    <div className="flex flex-col w-full p-4 border rounded overflow-hidden">
      <div className="flex justify-between mb-4">
        <div>
          <div className="font-bold">vTOKEN</div>
          <div>APR: {apr}</div>
          <div>Voting Power: {accountPower}</div>
          <div>Credit: {accountBorrowCredit} BASE</div>
          <div>Debt: {accountBorrowDebt} BASE</div>
        </div>
        <div className="text-right">
          <div>{accountBase}</div>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <div className="font-bold">oTOKEN</div>
          <div>Earned: {accountOTokenEarned}</div>
        </div>
        <div className="text-right">
          <div>{accountOToken}</div>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <div className="font-bold">TOKEN</div>
          <div>Earned: {accountTokenEarned}</div>
        </div>
        <div className="text-right">
          <div>{accountToken}</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="font-bold">BASE</div>
          <div>Earned: {accountBaseEarned}</div>
        </div>
        <div className="text-right">
          <div>{accountBase}</div>
        </div>
      </div>
    </div>
  );
};