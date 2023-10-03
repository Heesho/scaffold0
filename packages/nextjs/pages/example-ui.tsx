import type { NextPage } from "next";
import { GlobalData } from "~~/components/example-ui/GlobalData";
import PixelGrid from "~~/components/example-ui/PixelGrid";
import { PortfolioData } from "~~/components/example-ui/PortfolioData";
import UserActions from "~~/components/example-ui/UserActions";
import { UserData } from "~~/components/example-ui/UserData";
import GridGallery from "~~/components/example-ui/GridGallery";

// Import the new component

const ExampleUI: NextPage = () => {
  return (
    <div className="flex flex-col pt-8" data-theme="exampleUi">
      <div className="p-4 border rounded">
        <GlobalData />
      </div>
      <div className="flex mb-8 border p-4 rounded" data-theme="exampleUi">
        <div className="flex flex-col w-1/4 space-y-4">
          <PortfolioData />
          <UserData />
        </div>
        <div className="flex flex-col w-1/4 space-y-4">
          <UserActions />
        </div>
        <div className="flex flex-col w-1/2 space-y-4 items-center border">
          <GridGallery />
        </div>
      </div>
    </div>
  );
};

export default ExampleUI;
