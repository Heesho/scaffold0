import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const UnstakeAction = () => {
  const { address } = useAccount();

  const [inputValue, setInputValue] = useState("1"); // Initialize with 1

  const { data: maxWithdraw } = useScaffoldContractRead({
    contractName: "TOKENRewarder",
    functionName: "getMaxWithdraw",
    args: [address],
  });

  const balance = useScaffoldContractRead({
    contractName: "TOKENRewarder",
    functionName: "balanceOfTOKEN",
    args: [address],
  });

  const formattedMaxWithdraw = maxWithdraw !== undefined ? `${parseFloat(formatUnits(maxWithdraw, 18)).toFixed(4)}` : "N/A";
  const formattedBalance =
    balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";

  const { writeAsync: unstakeAsync } = useScaffoldContractWrite({
    contractName: "TOKENRewarder",
    functionName: "withdraw",
    args: [], // We will fill this in handleStake
  });

  const handleUnstake = async () => {

    // Define the arguments for the buy function
    const weiValue = BigInt(parseFloat(inputValue) * 10 ** 18);

    // Execute the buy transaction using the buyAsync function
    await unstakeAsync({
      args: [weiValue],
    });
  };

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between border p-2">
        <input type="number" className="border p-1" placeholder="0.0" value={inputValue} onChange={handleInputChange} />
        <div className="text-right">
          <span>vTOKEN</span>
          <div>Balance: {formattedBalance}</div>
          <div>Max Withdraw: {formattedMaxWithdraw}</div>
        </div>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleUnstake}>
        Unstake
      </button>
    </div>
  );
};
