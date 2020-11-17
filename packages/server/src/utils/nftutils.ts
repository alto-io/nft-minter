require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const ethers = require('ethers');

const CONTRACT_INFO = require('../contracts.json');

const INFURA_KEY = process.env.INFURA_API_KEY
const MNEMONIC = process.env.MNEMONIC
const NETWORK = CONTRACT_INFO.name;
const CONTRACT_ABI = CONTRACT_INFO.contracts.ERC1155Opensea.abi;
const CONTRACT_ADDRESS = CONTRACT_INFO.contracts.ERC1155Opensea.address;
const OWNER_ADDRESS = ethers.Wallet.fromMnemonic(MNEMONIC).address;


let RPC_URL;

if (NETWORK == 'localhost')
{
    RPC_URL = "http://localhost:8545/";
}

else
{
    RPC_URL = `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`;
}

const provider = new HDWalletProvider(MNEMONIC, RPC_URL);
const web3Instance = new web3(provider);

export async function mintNFT(tokenid, address) {

  const nftContract = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })

  let result;

  try {
    console.log("Minting Token " + tokenid + " to " + address + "...");
    let mintResult = await nftContract.methods.mint(address, tokenid, 1, []).send({ from: OWNER_ADDRESS });
    let newBalance = await nftContract.methods.balanceOf(address, tokenid).call();
 
    result = {
      transactionHash: mintResult.transactionHash,
      newBalance
    }

    console.log(result);


  } catch (e)
  {
    console.log(e);
    result = e.toString();
  }

  return result;
 
}