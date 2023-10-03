import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const PROVIDER_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const ExerciseAction = () => {
  const { address } = useAccount();

  const [inputValue, setInputValue] = useState("1"); // Initialize with 1
  const [isApprovedOTOKEN, setIsApprovedOTOKEN] = useState(false);
  const [isApprovedBASE, setIsApprovedBASE] = useState(false);

  const baseValue = (parseFloat(inputValue) / 10000).toFixed(8);

  const balanceOTOKEN = useScaffoldContractRead({
    contractName: "OTOKEN",
    functionName: "balanceOf",
    args: [address],
  });

  const formattedBalanceOTOKEN =
    balanceOTOKEN.data !== undefined ? `${parseFloat(formatUnits(balanceOTOKEN.data, 18)).toFixed(4)}` : "N/A";

  const balanceBASE = useScaffoldContractRead({
    contractName: "ERC20Mock",
    functionName: "balanceOf",
    args: [address],
  });

  const formattedBalanceBASE =
    balanceBASE.data !== undefined ? `${parseFloat(formatUnits(balanceBASE.data, 18)).toFixed(4)}` : "N/A";

    const { data: tokenContract } = useScaffoldContract({
      contractName: "TOKEN",
    });
  
    const tokenAddress = tokenContract?.address;

    const { writeAsync: approveAsyncOTOKEN } = useScaffoldContractWrite({
      contractName: "OTOKEN",
      functionName: "approve",
      args: [tokenAddress, MAX_UINT256],
    });

    const { writeAsync: approveAsyncBASE } = useScaffoldContractWrite({
      contractName: "ERC20Mock",
      functionName: "approve",
      args: [tokenAddress, MAX_UINT256],
    });

    const allowanceDataBASE = useScaffoldContractRead({
      contractName: "ERC20Mock",
      functionName: "allowance",
      args: [address, tokenAddress],
    });

    const allowanceDataOTOKEN = useScaffoldContractRead({
      contractName: "OTOKEN",
      functionName: "allowance",
      args: [address, tokenAddress],
    });

    useEffect(() => {
      if (allowanceDataOTOKEN.data !== undefined && inputValue !== undefined) {
        const requiredAllowance = BigInt(parseFloat(inputValue) * 10 ** 18);
        if (BigInt(allowanceDataOTOKEN.data) >= requiredAllowance) {
          setIsApprovedOTOKEN(true);
        }
      }
      if (allowanceDataBASE.data !== undefined && inputValue !== undefined) {
        const requiredAllowance = BigInt(parseFloat(inputValue) * 10 ** 18);
        if (BigInt(allowanceDataBASE.data) >= requiredAllowance) {
          setIsApprovedBASE(true);
        }
      }
    }, [allowanceDataOTOKEN, allowanceDataBASE, inputValue]);

    const { writeAsync: exerciseAsync } = useScaffoldContractWrite({
      contractName: "TOKEN",
      functionName: "exercise",
      args: [],
    });

    const handleExercise = async () => {
      // Check if the token is already approved
      if (!isApprovedOTOKEN) {
        await approveAsyncOTOKEN();
      }
      if (!isApprovedBASE) {
        await approveAsyncBASE();
      }
  
      // Define the arguments for the buy function
      const weiValue = BigInt(parseFloat(inputValue) * 10 ** 18);
  
      // Execute the buy transaction using the buyAsync function
      await exerciseAsync({
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
          <span>OTOKEN</span>
          <div>Balance: {formattedBalanceOTOKEN}</div>
        </div>
      </div>
      <div className="flex justify-center items-center my-2">+</div>
      <div className="flex justify-between border p-2">
        <div className="border p-2">{baseValue}</div>
        <div className="text-right">
          <span>BASE</span>
          <div>Balance: {formattedBalanceBASE}</div>
        </div>
      </div>
      <div className="flex justify-center items-center my-2">↓</div>
      <div className="flex justify-between border p-2">
        <div className="border p-2">{inputValue}</div>
        <span>TOKEN</span>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleExercise}>Exercise</button>
    </div>
  );
};
