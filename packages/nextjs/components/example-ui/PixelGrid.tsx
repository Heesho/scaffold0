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

  const { data: gridContract } = useScaffoldContract({
    contractName: "GridNFT",
  });

  const gridAddress = gridContract?.address;

  const allowanceData = useScaffoldContractRead({
    contractName: "OTOKEN",
    functionName: "allowance",
    args: [address, gridAddress],
  });

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
    setXSelected(x);
    setYSelected(y);
  };

  const handlePlaceTile = async () => {
    if (!isApproved) {
      await approveAsync();
    }
    await placeAsync();
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col items-center gap-2 border border-gray p-2">
        <div className="flex flex-col items-center">
          <p className="font-thin text-md text-gray-subtitle">Tile Selected: </p>
          <div className="flex gap-2 items-center">
            <p className="font-thin text-md text-gray-subtitle">
              X: <span> {ySelected}</span>{" "}
            </p>
            <p className="font-thin text-md text-gray-subtitle">
              Y: <span> {xSelected}</span>{" "}
            </p>
          </div>
        </div>
        <p className="font-thin text-md text-gray-subtitle">Choose a color: </p>
        <div className="flex items-center justify-center w-44 ">
          {Object.keys(colorMap).map(color => {
            return (
              <div
                key={color}
                className={`hover:border-2 hover:border-white-400  bg-[${color}] h-8 w-8`}
                style={{ backgroundColor: `${colorMap[Number(color)]}` }}
                onClick={() => setColorSelected(Number(color))}
              ></div>
            );
          })}
        </div>
        <div className="flex rounded p-2 gap-1">
          <div className="w-10 h-10 border border-white" style={{ backgroundColor: colorMap[colorSelected] }}></div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handlePlaceTile()}
          >
            Place
          </button>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-0 w-auto h-auto mx-auto">
        {gridData &&
          gridData.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
              const formattedColor = Number(tile.color);
              const isSelected = rowIndex === xSelected && colIndex === ySelected;
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 border ${isSelected ? "border-4 border-white" : "border-white"}`} // Apply a blue border if the tile is selected
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
