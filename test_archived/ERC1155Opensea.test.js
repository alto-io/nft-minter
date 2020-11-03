/* Contracts in this test */

const ERC1155Opensea = artifacts.require("../contracts/ERC1155Opensea.sol");
const { toNumber } = require('lodash');
const contractDetails = require('../temp_metadata/contracturi.json');
const contractConfig = require('../temp_metadata/erc1155config.json');
let _ = '        '

contract("ERC1155Opensea", (accounts) => {
  const CONTRACT_URI = contractConfig.gatewayUrl + "/" + contractConfig.contractUriHash  

  let myCollectible;

  // force load accounts
  let testAccounts =
  [
    '0xd4039eB67CBB36429Ad9DD30187B94f6A5122215',
    '0x7633Fe8542c2218B5A25777477F63D395aA5aFB4',
    '0xd5cC383881D6d9A7dc1891A0235E11D03Cb992d3',
    '0xa1D9cBa049eAfF292F654e416773470Ad939d6Ae',
    '0xc86E95d8c0a8352C0c633b51dc3de22Bd96D9E50',
    '0x5D109a0eB89D225181cd2bF03eE3f60f8B1cd2e6',
    '0x4c3Da80eAEc19399Bc4ce3486ec58755a875d645',
    '0xFc9077ACeD8cedAf17796e2992067b9BF8dd0764',
    '0x8d242e4bc081e2eeD5eb9d6BF734DdF5d2F435e0'
  ]

  before(async () => {
    myCollectible = await ERC1155Opensea.deployed();
  });

  describe('#constructor()', () => {
    it('should set the contractURI to the supplied value', async () => {
        let uri = await myCollectible.contractURI();
        console.log(_ + "uri: " + uri)
      assert.equal(uri, CONTRACT_URI);
    });

    it('should have a name and symbol string', async () => {
      let name = await myCollectible.name.call();
      let symbol = await myCollectible.symbol.call();
      console.log(_ + "name: " + name);
      console.log(_ + "symbol: " + symbol);
      assert.isString(name);
      assert.isString(symbol);
  });

  // it('test: create all tokens to owner account (for testing rinkeby)', async () => {
  //   const INIT_SUPPLY = 1;
  //   const OWNER = accounts[0];

  //   for (var i = 0; i < 100; i++) {
  //     let tokenId = await myCollectible.create.call(OWNER, INIT_SUPPLY, "", []);

  //     // assert this is token i
  //     assert.equal(tokenId.toNumber(), i);

  //     // call actual function
  //     await myCollectible.create(OWNER, INIT_SUPPLY, "", [])

  //     // assert uri is valid string
  //     let tokenUri = await myCollectible.uri(i);
  //     assert.isString(tokenUri);

  //     // assert that user has the appropriate number of tokens
  //     let ownerBalance = await myCollectible.balanceOf(OWNER, i);
  //     assert.equal(ownerBalance, INIT_SUPPLY);
  //   }
  // });


  // it('should allow owner to create tokens with initial supply', async () => {
  //   const INIT_SUPPLY = 5;
  //   const OWNER = accounts[0];

  //   let tokenId = await myCollectible.create.call(OWNER, INIT_SUPPLY, "", []);

  //   // assert this is token 0
  //   assert.equal(tokenId.toNumber(), 0);

  //   // call actual function
  //   await myCollectible.create(OWNER, INIT_SUPPLY, "", [])

  //   // assert uri is valid string
  //   let token0uri = await myCollectible.uri(0);
  //   assert.isString(token0uri);

  //   // assert that user has the appropriate number of tokens
  //   let ownerBalance = await myCollectible.balanceOf(OWNER, 0);
  //   assert.equal(ownerBalance, INIT_SUPPLY);
  // });

  // it('should allow owner to mint tokens to a list of addresses', async () => {
  //   const INIT_SUPPLY = 10;
  //   const OWNER = accounts[0];

  //   let tokenId = await myCollectible.create.call(OWNER, INIT_SUPPLY, "", []);

  //   // assert this is token 1
  //   assert.equal(tokenId.toNumber(), 1);

  //   // call actual function
  //   await myCollectible.create(OWNER, INIT_SUPPLY, "", [])

  //   // assert uri is valid string
  //   let token1uri = await myCollectible.uri(1);
  //   assert.isString(token1uri);

  //   // assert that user has the appropriate number of tokens
  //   let ownerBalance = await myCollectible.balanceOf(OWNER, 1);
  //   assert.equal(ownerBalance, INIT_SUPPLY);

  //   // mint 1 copy of token 0 to each test account, and verify balance
  //   testAccounts.map( async (testAccount) => {
  //     await myCollectible.mint(
  //       testAccount,
  //       0,
  //       1,
  //       []        
  //     )

  //     let balance = await myCollectible.balanceOf(testAccounts, 0);
  //     assert.equal(balance, 1);
  //   })

  //   // mint more than 1 copy of token 1 to each test account, and verify balance
  //   tokenAmounts = [
  //     2,3,4,5,6,7,8,9,10
  //   ]

  //   index = 0;

  //   testAccounts.map( async (testAccount) => {
  //     await myCollectible.mint(
  //       testAccount,
  //       1,
  //       tokenAmounts[index],
  //       []        
  //     )

  //     let balance = await myCollectible.balanceOf(testAccounts, 1);
  //     assert.equal(balance, tokenAmounts[index]);
  //     index++;
  //   })

  // });


  });
});
