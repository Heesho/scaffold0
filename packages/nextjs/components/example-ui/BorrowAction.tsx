import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const PROVIDER_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const BorrowAction = () => {
  const { address } = useAccount();

  const [inputValue, setInputValue] = useState("1"); // Initialize with 1

  const balance = useScaffoldContractRead({
    contractName: "ERC20Mock",
    functionName: "balanceOf",
    args: [address],
  });

  const credit = useScaffoldContractRead({
    contractName: "TOKEN",
    functionName: "getAccountCredit",
    args: [address],
    });

  const formattedBalance =
    balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";

    const formattedCredit = credit.data !== undefined ? `${parseFloat(formatUnits(credit.data, 18)).toFixed(4)}` : "N/A";

  const { writeAsync: borrowAsync } = useScaffoldContractWrite({
    contractName: "TOKEN",
    functionName: "borrow",
    args: [], // We will fill this in handleBuy
  });

  const handleBorrow = async () => {

    // Define the arguments for the buy function
    const weiValue = BigInt(parseFloat(inputValue) * 10 ** 18);

    // Execute the buy transaction using the buyAsync function
    await borrowAsync({
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
          <div>Credit: {formattedCredit}</div>
        </div>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleBorrow}>
        Borrow
      </button>
    </div>
  );
};
