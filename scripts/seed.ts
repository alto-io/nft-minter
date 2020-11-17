import {ethers} from 'hardhat';

function waitFor<T>(p: Promise<{wait: () => Promise<T>}>): Promise<T> {
  return p.then((tx) => tx.wait());
}

async function main() {
  const accounts = await ethers.provider.listAccounts();
  const OWNER_ADDRESS = accounts[0];

  console.log("======================================")

  console.log("Starting seeding initial NFTs...")
  console.log("Owner :" + OWNER_ADDRESS)

  console.log("======================================")


  for (let i = 0; i < 6; i++) {
      const nftContract = await ethers.getContract('ERC1155Opensea', OWNER_ADDRESS);
      await waitFor(nftContract.create(OWNER_ADDRESS, 1, "", []));
      console.log((i + 1) + " of 5 to " + OWNER_ADDRESS);
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });