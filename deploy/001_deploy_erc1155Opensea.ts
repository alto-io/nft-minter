import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const RINKEBY = "4";
const fs = require('fs');
const rfs = require('recursive-fs');

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();
  const network = await hre.getChainId();
 
  const TEMP_METADATA_DIR = './temp_metadata';
  const GIST_URL_PREFIX = "http://gist.github.com/raw/"

  let gistId;
  let contractUri;
  let baseMetadataUri;
  let contractName;
  let contractSymbol;

  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress;
  if (network === RINKEBY) {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  // get the contract parameters
  {
    let {files, dirs} = await rfs.read(TEMP_METADATA_DIR);
    
    // on clean run, dirs[1] should contain the directory
    gistId = dirs[1].split(TEMP_METADATA_DIR).pop().split("/")[1];
    console.log("found metadata on github gist: " + gistId);

    // set the uris
    contractUri = GIST_URL_PREFIX + gistId;
    baseMetadataUri = contractUri;

    // files[0] should contain the contract uri file, read it and get the name and symbol
    const data = JSON.parse(fs.readFileSync(files[0]).toString())
    contractName = data.name;
    contractSymbol = data.symbol;
  }

  console.log("------")
  console.log("network: " + network);
  console.log("uri: " + contractUri);
  console.log("name: " + contractName);
  console.log("symbol: " + contractSymbol);
  console.log("------")

  await deploy('ERC1155Opensea', {
    from: deployer,
    args: [
      proxyRegistryAddress,
      contractUri,
      baseMetadataUri,
      contractName,
      contractSymbol
    ],
    log: true
  });
};

export default func;
func.tags = ['ERC1155Opensea'];