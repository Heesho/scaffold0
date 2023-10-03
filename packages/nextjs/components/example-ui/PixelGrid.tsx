import React, { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type colorMapType = { [key: number]: string };

const colorMap: colorMapType = {
  0: "#000000",
  1: "#18fc03",
  2: "#fce303",
  3: "#fc0317",
  4: "#03a5fc",
  5: "#db03fc",
};

const MAX_UINT256 = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

const PixelGrid: React.FC = () => {
  const { address } = useAccount();
  const [colorSelected, setColorSelected] = useState<number>(0);
  const [xSelected, setXSelected] = useState<number>(0);
  const [ySelected, setYSelected] = useState<number>(0);
  const [isApproved, setIsApproved] = useState(false);

  const balance = useScaffoldContractRead({
    contractName: "OTOKEN",
    functionName: "balanceOf",
    args: [address],
  });

  const formattedBalance =
    balance.data !== undefined ? `${parseFloat(formatUnits(balance.data, 18)).toFixed(4)}` : "N/A";


  const { data: gridContract } = useScaffoldContract({
    contractName: "GridNFT",
  });

  const gridAddress = gridContract?.address;

  const allowanceData = useScaffoldContractRead({
    contractName: "OTOKEN",
    functionName: "allowance",
    args: [address, gridAddress],
  });

  const [selectedPixels, setSelectedPixels] = useState<{ x: number, y: number }[]>([]);

  useEffect(() => {
    if (allowanceData.data !== undefined) {
      const requiredAllowance = BigInt("1000000000000000000");
      if (BigInt(allowanceData.data) >= requiredAllowance) {
        setIsApproved(true);
      }
    }
  }, [allowanceData]);

  const { writeAsync: approveAsync } = useScaffoldContractWrite({
    contractName: "OTOKEN",
    functionName: "approve",
    args: [gridAddress, MAX_UINT256],
  });

  const { data: gridData } = useScaffoldContractRead({
    contractName: "Multicall",
    functionName: "getGrid",
    args: [BigInt("0")],
  });

  const { writeAsync: placeAsync } = useScaffoldContractWrite({
    contractName: "GridNFT",
    functionName: "placeFor",
    args: [BigInt("0"), address, [BigInt(xSelected)], [BigInt(ySelected)], BigInt(colorSelected)],
  });

  const handleTileSectionClick = (x: number, y: number) => {
    // Check if the pixel is already selected
    const pixelAlreadySelected = selectedPixels.some(pixel => pixel.x === x && pixel.y === y);

    if (pixelAlreadySelected) {
      setSelectedPixels(prev => prev.filter(pixel => !(pixel.x === x && pixel.y === y)));
    } else {
      setSelectedPixels(prev => [...prev, { x, y }]);
    }
  };

  const handlePlaceTile = async () => {
    if (!isApproved) {
      await approveAsync();
    }
    const xValues = selectedPixels.map(pixel => BigInt(pixel.x));
    const yValues = selectedPixels.map(pixel => BigInt(pixel.y));
    await placeAsync({
      args: [BigInt("0"), address, xValues, yValues, BigInt(colorSelected)],
    });

    setSelectedPixels([]);
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-2 border border-gray p-2 w-32">
        {/* Displaying OTOKEN spending and balance */}
        <p className="font-thin text-md text-gray-subtitle">Tiles to Place: {selectedPixels.length}</p>
        <p className="font-thin text-md text-gray-subtitle">OTOKEN Balance: {formattedBalance}</p>

        <p className="font-thin text-md text-gray-subtitle mt-2 mb-2">Color: </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.keys(colorMap).map(color => {
            return (
              <div
                key={color}
                className={`hover:border-2 hover:border-white-400 rounded-full h-6 w-6`}
                style={{ backgroundColor: `${colorMap[Number(color)]}` }}
                onClick={() => setColorSelected(Number(color))}
              ></div>
            );
          })}
        </div>
        <div 
          className="rounded-lg h-6 w-full"
          style={{ backgroundColor: colorMap[colorSelected] }}
        ></div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 mt-2 rounded w-full"
          onClick={() => handlePlaceTile()}
        >
          Place
        </button>
      </div>
            <div className="grid grid-cols-10 gap-0 w-auto h-auto mx-auto">
        {gridData &&
          gridData.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
              const formattedColor = Number(tile.color);
              const isSelected = selectedPixels.some(pixel => pixel.x === rowIndex && pixel.y === colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 ${isSelected ? "border-4 border-white" : "border-white"}`} 
                  style={{ backgroundColor: colorMap[formattedColor] }}
                  onClick={() => {
                    handleTileSectionClick(rowIndex, colIndex);
                  }}
                ></div>
              );
            }),
          )}
      </div>
    </div>
  );
};

export default PixelGrid;
