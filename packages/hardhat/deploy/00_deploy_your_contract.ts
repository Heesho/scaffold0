import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { token } from "../typechain-types/@openzeppelin/contracts";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, getArtifact, save, get, execute} = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const base = await deploy("ERC20Mock", {
    from: deployer,
    // Contract constructor arguments
    args: ['BASE', 'BASE'],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const oTokenFactory = await deploy("OTOKENFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const rewarderFactory = await deploy("TOKENRewarderFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const feesFactory = await deploy("TOKENFeesFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("TOKEN", {
    from: deployer,
    // Contract constructor arguments
    args: [base.address, oTokenFactory.address, rewarderFactory.address, feesFactory.address],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await hre.deployments.delete("OTOKENFactory");
  await hre.deployments.delete("TOKENRewarderFactory");
  await hre.deployments.delete("TOKENFeesFactory");

  const token = await hre.ethers.getContract("TOKEN", deployer);

  const feesArtifact = await getArtifact("TOKENFees");
  await save("TOKENFees", {
    abi: feesArtifact.abi,
    address: await token.fees(),
  });

  const rewarderArtifact = await getArtifact("TOKENRewarder");
  await save("TOKENRewarder", {
    abi: rewarderArtifact.abi,
    address: await token.rewarder(),
  });

  const oTokenArtifact = await getArtifact("OTOKEN");
  await save("OTOKEN", {
    abi: oTokenArtifact.abi,
    address: await token.OTOKEN(),
  });

  const gridRewarderFactory = await deploy("GridRewarderFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const gridNFTResult = await deploy("GridNFT", {
    from: deployer,
    // Contract constructor arguments
    args: [await token.OTOKEN(), gridRewarderFactory.address],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const gridNFT = await hre.ethers.getContract("GridNFT", deployer);
  const gridRewarderArtifact = await getArtifact("GridRewarder");
  await save("GridRewarder", {
    abi: gridRewarderArtifact.abi,
    address: await gridNFT.gridRewarder(),
  });

  await hre.deployments.delete("GridRewarderFactory");

  const minterResult = await deploy("Minter", {
    from: deployer,
    // Contract constructor arguments
    args: [await token.OTOKEN(), token.address, await gridNFT.gridRewarder()],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const multicall = await deploy("Multicall", {
    from: deployer,
    // Contract constructor arguments
    args: [base.address, token.address, await token.OTOKEN(), await token.rewarder(), gridNFT.address, await gridNFT.gridRewarder(), minterResult.address],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const oToken = await hre.ethers.getContract("OTOKEN", await token.OTOKEN());
  const minter = await hre.ethers.getContract("Minter", minterResult.address);

  await execute("OTOKEN", 
    {from: deployer, log: true, autoMine: true},
    "setMinter",
    minterResult.address,
  );

  await execute("Minter", 
    {from: deployer, log: true, autoMine: true},
    "initialize",
  );

  await execute("GridNFT", 
    {from: deployer, log: true, autoMine: true},
    "setColors",
    ["#000000", "#18fc03", "#fce303", "#fc0317", "#03a5fc", "#db03fc"],
  );

  await execute("GridNFT", 
  {from: deployer, log: true, autoMine: true},
  "safeMint",
  deployer,
);




};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract", "ERC20Mock", "TOKEN", "OTOKEN", "TOKENFees", "TOKENRewarder", "GridNFT", "GridRewarder", "Minter", "Multicall"];
