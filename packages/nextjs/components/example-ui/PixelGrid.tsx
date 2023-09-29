import React from 'react';
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const colorMap = {
  0: "#000000",
  1: "#18fc03",
  2: "#fce303",
  3: "#fc0317",
  4: "#03a5fc",
  5: "#db03fc"
};

const PixelGrid: React.FC = () => {
  const { data: gridData } = useScaffoldContractRead({
    contractName: "Multicall",
    functionName: "getGrid",
    args: [BigInt('0')],
  });

  return (
    <div className="grid grid-cols-10 gap-0 w-auto h-auto mx-auto">
      {gridData && gridData.map((row, rowIndex) => 
        row.map((tile, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`} 
            className="w-12 h-12 border border-white"
            style={{ backgroundColor: colorMap[tile.color] }}
          ></div>
        ))
      )}
    </div>
  );
};

export default PixelGrid;

