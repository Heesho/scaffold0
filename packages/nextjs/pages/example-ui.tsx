import type { NextPage } from "next";
import { PortfolioData } from "~~/components/example-ui/PortfolioData";
import { GlobalData } from "~~/components/example-ui/GlobalData";
import { UserData } from "~~/components/example-ui/UserData";
import UserActions from "~~/components/example-ui/UserActions";
import PixelGrid from "~~/components/example-ui/PixelGrid"; // Import the new component

const ExampleUI: NextPage = () => {
  return (
    <div className="flex flex-col flex-grow pt-8" data-theme="exampleUi">
      <div className="mb-8 p-4 border rounded">
        <GlobalData />
      </div>
      <div className="flex flex-row flex-grow mb-8 border p-4 rounded" data-theme="exampleUi">
        <div className="flex flex-col w-1/4 space-y-4">
          <PortfolioData />
          <UserData />
        </div>
        <div className="flex flex-col w-1/4 space-y-4">
          <UserActions />
        </div>
        <div className="flex flex-col w-1/2 space-y-4 items-start">
          <PixelGrid />
        </div>
      </div>
    </div>
  );
};

export default ExampleUI;











