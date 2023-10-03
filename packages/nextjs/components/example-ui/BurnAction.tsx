import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const BurnAction = () => {
  const { address } = useAccount();

  const [inputValue, setInputValue] = useState("1"); // Initialize with 1
  const [isApproved, setIsApproved] = useState(false);

  const balance = useScaffoldContractRead({
    contractName: "OTOKEN",
    functionName: "balanceOf",
    args: [address],
  });

  const formattedBalance =
    balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";

  const { data: rewarderContract } = useScaffoldContract({
    contractName: "TOKENRewarder",
  });

  const rewarderAddress = rewarderContract?.address;

  const allowanceData = useScaffoldContractRead({
    contractName: "OTOKEN",
    functionName: "allowance",
    args: [address, rewarderAddress],
  });

  useEffect(() => {
    if (allowanceData.data !== undefined && inputValue !== undefined) {
      const requiredAllowance = BigInt(parseFloat(inputValue) * 10 ** 18);
      if (BigInt(allowanceData.data) >= requiredAllowance) {
        setIsApproved(true);
      }
    }
  }, [allowanceData, inputValue]);

  const { writeAsync: approveAsync } = useScaffoldContractWrite({
    contractName: "OTOKEN",
    functionName: "approve",
    args: [rewarderAddress, MAX_UINT256],
  });

  const { writeAsync: burnAsync } = useScaffoldContractWrite({
    contractName: "TOKENRewarder",
    functionName: "burnFor",
    args: [], // We will fill this in handleStake
  });

  const handleBurn = async () => {
    // Check if the token is already approved
    if (!isApproved) {
      await approveAsync();
    }

    // Define the arguments for the buy function
    const weiValue = BigInt(parseFloat(inputValue) * 10 ** 18);

    // Execute the buy transaction using the buyAsync function
    await burnAsync({
      args: [address, weiValue],
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
          <span>oTOKEN</span>
          <div>Balance: {formattedBalance}</div>
        </div>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleBurn}>
        Burn
      </button>
    </div>
  );
};
