import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployZkTreasure: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("zkTreasure", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const zkTreasureContract = await hre.ethers.getContract("zkTreasure", deployer);
  console.log("👋 zkTreasure contract deployed successfully" + zkTreasureContract);
};

export default deployZkTreasure;

deployZkTreasure.tags = ["zkTreasure"];
