import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const PROVIDER_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const RedeemAction = () => {
  const { address } = useAccount();

  const [inputValue, setInputValue] = useState("1"); // Initialize with 1
  const [isApproved, setIsApproved] = useState(false);

  const baseValue = (parseFloat(inputValue) / 10000).toFixed(8);

  const balance = useScaffoldContractRead({
    contractName: "TOKEN",
    functionName: "balanceOf",
    args: [address],
  });
  const maxRedeem = useScaffoldContractRead({
    contractName: "TOKEN",
    functionName: "frBASE",
});

  const formattedBalance =
    balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";

    const formattedMaxRedeem = maxRedeem.data !== undefined ? `${parseFloat(formatUnits(maxRedeem.data * BigInt(10000), 18)).toFixed(4)}` : "N/A";


    const { data: tokenContract } = useScaffoldContract({
      contractName: "TOKEN",
    });
  
    const tokenAddress = tokenContract?.address;

    const { writeAsync: approveAsync} = useScaffoldContractWrite({
      contractName: "TOKEN",
      functionName: "approve",
      args: [tokenAddress, MAX_UINT256],
    });

    const allowanceData = useScaffoldContractRead({
      contractName: "TOKEN",
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

    const { writeAsync: redeemAsync } = useScaffoldContractWrite({
      contractName: "TOKEN",
      functionName: "redeem",
      args: [],
    });

    const handleRedeem= async () => {
      // Check if the token is already approved
      if (!isApproved) {
        await approveAsync();
      }
  
      // Define the arguments for the buy function
      const weiValue = BigInt(parseFloat(inputValue) * 10 ** 18);
  
      // Execute the buy transaction using the buyAsync function
      await redeemAsync({
        args: [weiValue, address],
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
          <span>TOKEN</span>
          <div>Balance: {formattedBalance}</div>
          <div>Max Redeem: {formattedMaxRedeem}</div>
        </div>
      </div>
      <div className="flex justify-center items-center my-2">↓</div>
      <div className="flex justify-between border p-2">
        <div className="border p-2">{baseValue}</div>
        <div className="text-right">
          <span>BASE</span>
        </div>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleRedeem}>Redeem</button>
    </div>
  );
};
