import React, { useState, useEffect } from 'react';
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldContract } from "~~/hooks/scaffold-eth";
import { formatUnits } from "viem";

const PROVIDER_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

export const BuyAction = () => {
    const { address } = useAccount();

    const [inputValue, setInputValue] = useState('1'); // Initialize with 1
    const [isApproved, setIsApproved] = useState(false);

    const balance = useScaffoldContractRead({
        contractName: "ERC20Mock",
        functionName: "balanceOf",
        args: [address],
    });

    const formattedBalance = balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";

    const swap = useScaffoldContractRead({
        contractName: "Multicall",
        functionName: "quoteBuyIn",
        args: [BigInt(parseFloat(inputValue) * 10**18), BigInt('9000')],
    });

    const [output, slippage, minOutput, autoMinOutput] = swap.data || [];
    const formattedOutput = output !== undefined ? `${parseFloat(formatUnits(output, 18)).toFixed(4)}` : "N/A";
    const formattedSlippage = slippage !== undefined ? `${parseFloat(formatUnits(slippage, 18)).toFixed(4)}%` : "N/A";
    const formattedMinOutput = minOutput !== undefined ? `${parseFloat(formatUnits(minOutput, 18)).toFixed(4)}` : "N/A";
    const formattedAutoMinOutput = autoMinOutput !== undefined ? `${parseFloat(formatUnits(autoMinOutput, 18)).toFixed(4)} TOKEN` : "N/A";

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
            const requiredAllowance = BigInt(parseFloat(inputValue) * 10**18);
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

    const { writeAsync: buyAsync } = useScaffoldContractWrite({
        contractName: "TOKEN",
        functionName: "buy",
        args: [], // We will fill this in handleBuy
    });

    const handleBuy = async () => {
        // Check if the token is already approved
        if (!isApproved) {
            await approveAsync();
        }
    
        // Define the arguments for the buy function
        const weiValue = BigInt(parseFloat(inputValue) * 10**18);
        const expireTimestamp = BigInt(Date.now() + 20 * 60 * 1000);
    
        // Execute the buy transaction using the buyAsync function
        await buyAsync({
            args: [weiValue, BigInt('0'), expireTimestamp, address, PROVIDER_ADDRESS]
        });
    };
    

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between border p-2">
                <input 
                    type="number" 
                    className="border p-1" 
                    placeholder="0.0" 
                    value={inputValue} 
                    onChange={handleInputChange}
                />
                <div className="text-right">
                    <span>BASE</span>
                    <div>Balance: {formattedBalance}</div>
                </div>
            </div>
            <div className="flex justify-center items-center my-2">
                ↓
            </div>
            <div className="flex justify-between border p-2">
                <div className="border p-2">{formattedOutput}</div>
                <span>TOKEN</span>
            </div>
            <div className="border p-2">
                <div className="flex justify-between">
                    <span>Losses (0.3% fee + slippage)</span>
                    <span>{formattedSlippage}</span>
                </div>
                <div className="flex justify-between mt-2">
                    <span>Minimum Output</span>
                    <span>{formattedAutoMinOutput}</span>
                </div>
            </div>
            <button className="bg-blue-500 text-white p-2 rounded mt-2 w-full" onClick={handleBuy}>Buy</button>
        </div>
    );
};
