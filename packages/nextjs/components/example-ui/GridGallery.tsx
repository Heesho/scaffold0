import React, { useEffect, useState } from "react";
import PixelGrid from "./PixelGrid";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const GridGallery: React.FC = () => {
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [nftSVGs, setNftSVGs] = useState<string[]>([]);

  const nfts = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const svgData = nfts.map(nft =>
    useScaffoldContractRead({
      contractName: "GridNFT",
      functionName: "tokenURI",
      args: [BigInt(nft)],
    }),
  );

  useEffect(() => {
    const svgs: string[] = svgData.map(data => data.data || "");
    setNftSVGs(svgs);
  }, [svgData]);

  if (selectedNFT !== null) {
    return <PixelGrid nftId={selectedNFT} onBack={() => setSelectedNFT(null)} />;
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-4 mb-3 w-full">
        <h2 className="text-2xl">31st Century Farmers</h2>
      </div>

      {/* This div wraps the color selector and the gallery grid */}
      <div className="flex w-full">
        <div className="flex flex-col gap-2 border border-gray p-2 w-32">
          <div className="rounded-lg h-6 w-full"></div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0px",
          }}
        >
          {nfts.map((nft, index) => (
            <div
              key={nft}
              onClick={() => setSelectedNFT(nft)}
              style={{
                cursor: "pointer",
                width: "160px",
                height: "160px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              onMouseOver={e => (e.currentTarget.style.border = "2px solid white")}
              onMouseOut={e => (e.currentTarget.style.border = "none")}
            >
              <div
                dangerouslySetInnerHTML={{ __html: nftSVGs[index] || "" }}
                style={{
                  transform: "scale(0.46)",
                  position: "absolute",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridGallery;
