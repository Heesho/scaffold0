import React, { useEffect, useState } from "react";
import { BuyAction } from "~~/components/example-ui/BuyAction";
import { ExerciseAction } from "~~/components/example-ui/ExerciseAction";
import { SellAction } from "~~/components/example-ui/SellAction";
import { RedeemAction } from "~~/components/example-ui/RedeemAction";
import { StakeAction } from "~~/components/example-ui/StakeAction";
import { UnstakeAction } from "~~/components/example-ui/UnstakeAction";
import { BurnAction } from "./BurnAction";
import { BorrowAction } from "./BorrowAction";
import { RepayAction } from "./RepayAction";

const UserActions: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>("Swap");
  const [selectedSecondaryAction, setSelectedSecondaryAction] = useState<string>("Buy");

  useEffect(() => {
    switch (selectedAction) {
      case "Swap":
        setSelectedSecondaryAction("Buy");
        break;
      case "Options":
        setSelectedSecondaryAction("Exercise");
        break;
      case "Earn":
        setSelectedSecondaryAction("Stake");
        break;
      case "Lend":
        setSelectedSecondaryAction("Borrow");
        break;
      default:
        break;
    }
  }, [selectedAction]);

  const renderSecondaryButtons = () => {
    switch (selectedAction) {
      case "Swap":
        return (
          <>
            <button
              onClick={() => setSelectedSecondaryAction("Buy")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Buy" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Buy
            </button>
            <button
              onClick={() => setSelectedSecondaryAction("Sell")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Sell" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Sell
            </button>
          </>
        );
      case "Options":
        return (
          <>
            <button
              onClick={() => setSelectedSecondaryAction("Exercise")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Exercise" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Exercise
            </button>
            <button
              onClick={() => setSelectedSecondaryAction("Redeem")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Redeem" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Redeem
            </button>
          </>
        );
      case "Earn":
        return (
          <>
            <button
              onClick={() => setSelectedSecondaryAction("Stake")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Stake" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Stake
            </button>
            <button
              onClick={() => setSelectedSecondaryAction("Unstake")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Unstake" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Unstake
            </button>
            <button
              onClick={() => setSelectedSecondaryAction("Burn")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Burn" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Burn
            </button>
          </>
        );
      case "Lend":
        return (
          <>
            <button
              onClick={() => setSelectedSecondaryAction("Borrow")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Borrow" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Borrow
            </button>
            <button
              onClick={() => setSelectedSecondaryAction("Repay")}
              className={`flex-1 text-center py-1 rounded ${
                selectedSecondaryAction === "Repay" ? "bg-gray-300" : "bg-gray-200"
              } hover:bg-gray-300`}
            >
              Repay
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const renderActionComponent = () => {
    const commonStyles = "p-4 border rounded flex-grow";

    if (selectedAction === "Swap") {
      if (selectedSecondaryAction === "Buy") return <BuyAction />;
      if (selectedSecondaryAction === "Sell") return <SellAction />;
    }
    if (selectedAction === "Options") {
      if (selectedSecondaryAction === "Exercise") return <ExerciseAction />;
      if (selectedSecondaryAction === "Redeem") return <RedeemAction />;
    }
    if (selectedAction === "Earn") {
      if (selectedSecondaryAction === "Stake") return <StakeAction />;
      if (selectedSecondaryAction === "Unstake") return <UnstakeAction />;
      if (selectedSecondaryAction === "Burn") return <BurnAction />;
    }
    if (selectedAction === "Lend") {
      if (selectedSecondaryAction === "Borrow") return <BorrowAction />;
      if (selectedSecondaryAction === "Repay") return <RepayAction />;
    }
    return null; // default case
  };

  return (
    <div className="flex flex-col p-4 border rounded space-y-4">
      <div className="flex">
        <button
          onClick={() => {
            setSelectedAction("Swap");
            setSelectedSecondaryAction("Buy");
          }}
          className={`flex-1 text-center py-2 rounded ${
            selectedAction === "Swap" ? "bg-gray-300" : "bg-gray-200"
          } hover:bg-gray-300`}
        >
          Swap
        </button>
        <button
          onClick={() => {
            setSelectedAction("Options");
            setSelectedSecondaryAction("Exercise");
          }}
          className={`flex-1 text-center py-2 rounded ${
            selectedAction === "Options" ? "bg-gray-300" : "bg-gray-200"
          } hover:bg-gray-300`}
        >
          Options
        </button>
        <button
          onClick={() => {
            setSelectedAction("Earn");
            setSelectedSecondaryAction("Stake");
          }}
          className={`flex-1 text-center py-2 rounded ${
            selectedAction === "Earn" ? "bg-gray-300" : "bg-gray-200"
          } hover:bg-gray-300`}
        >
          Earn
        </button>
        <button
          onClick={() => {
            setSelectedAction("Lend");
            setSelectedSecondaryAction("Borrow");
          }}
          className={`flex-1 text-center py-2 rounded ${
            selectedAction === "Lend" ? "bg-gray-300" : "bg-gray-200"
          } hover:bg-gray-300`}
        >
          Lend
        </button>
      </div>
      <div className="flex space-x-2 mt-2">{renderSecondaryButtons()}</div>
      <div className="mt-4">{renderActionComponent()}</div>
    </div>
  );
};

export default UserActions;
