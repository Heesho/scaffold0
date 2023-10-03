import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const PROVIDER_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const RepayAction = () => {
  const { address } = useAccount();

  const [inputValue, setInputValue] = useState("1"); // Initialize with 1
  const [isApproved, setIsApproved] = useState(false);

  const balance = useScaffoldContractRead({
    contractName: "ERC20Mock",
    functionName: "balanceOf",
    args: [address],
  });

  const debt = useScaffoldContractRead({
    contractName: "TOKEN",
    functionName: "debts",
    args: [address],
  });

  const formattedBalance =
    balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";

  const formattedDebt = debt.data !== undefined ? `${parseFloat(formatUnits(debt.data, 18)).toFixed(4)}` : "N/A";

  const { data: tokenContract } = useScaffoldContract({
    contractName: "TOKEN",
  });

  const tokenAddress = tokenContract?.address;

  const allowanceData = useScaffoldContractRead({
    contractName: "ERC20Mock",
    functionName: "allowance",
    args: [address, tokenAddress],
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
    contractName: "ERC20Mock",
    functionName: "approve",
    args: [tokenAddress, MAX_UINT256],
  });

  const { writeAsync: repayAsync } = useScaffoldContractWrite({
    contractName: "TOKEN",
    functionName: "repay",
    args: [], // We will fill this in handleBuy
  });

  const handleRepay = async () => {
    // Check if the token is already approved
    if (!isApproved) {
      await approveAsync();
    }

    // Define the arguments for the buy function
    const weiValue = BigInt(parseFloat(inputValue) * 10 ** 18);

    // Execute the buy transaction using the buyAsync function
    await repayAsync({
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
          <span>BASE</span>
          <div>Balance: {formattedBalance}</div>
          <div>Debt: {formattedDebt}</div>
        </div>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleRepay}>
        Repay
      </button>
    </div>
  );
};
