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
        <div className="border p-2">{inputValue}</div>
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
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full">Exercise</button>
    </div>
  );
};
