require("@nomiclabs/hardhat-waffle");

const { expect } = require("chai");

const OPENSEA_PROXY_CONTRACT = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
const CONTRACT_URI = "https://example-uri.com";
const METADATA_URI = "https://example-metadata-uri.com";
const EXAMPLE_NAME = "test erc1155";
const EXAMPLE_SYMBOL = "TEST";
const _ = '        '

describe("ERC1155Opensea", function() {
  it("should set the contractURI to the supplied value", async function() {
    const ERC1155Opensea = await ethers.getContractFactory("ERC1155Opensea");
    const erc1155 = await ERC1155Opensea.deploy(
        OPENSEA_PROXY_CONTRACT,
        CONTRACT_URI,
        METADATA_URI,
        EXAMPLE_NAME,
        EXAMPLE_SYMBOL
        )
    let uri = await erc1155.contractURI();
    console.log(_ + "uri: " + uri)

    expect(uri).to.equal(CONTRACT_URI);
  });

  it('should have a name and symbol string', async () => {
    const ERC1155Opensea = await ethers.getContractFactory("ERC1155Opensea");
    const erc1155 = await ERC1155Opensea.deploy(
        OPENSEA_PROXY_CONTRACT,
        CONTRACT_URI,
        METADATA_URI,
        EXAMPLE_NAME,
        EXAMPLE_SYMBOL
        )

    let name = await erc1155.name.call();
    let symbol = await erc1155.symbol.call();
    console.log(_ + "name: " + name);
    console.log(_ + "symbol: " + symbol);
    expect(name).to.equal(EXAMPLE_NAME);
    expect(symbol).to.equal(EXAMPLE_SYMBOL);
    });

  it('test: create all tokens to owner account', async () => {
    const INIT_SUPPLY = 1;
    const accounts = await ethers.getSigners();
    const OWNER = accounts[0].address;

    const ERC1155Opensea = await ethers.getContractFactory("ERC1155Opensea");
    const erc1155 = await ERC1155Opensea.deploy(
        OPENSEA_PROXY_CONTRACT,
        CONTRACT_URI,
        METADATA_URI,
        EXAMPLE_NAME,
        EXAMPLE_SYMBOL
        )

    for (var i = 0; i < 5; i++) {
      await erc1155.create(OWNER, INIT_SUPPLY, "", [])

      // assert uri is valid string
      let tokenUri = await erc1155.uri(i);
      expect(tokenUri).to.be.a('string');

      // assert that user has the appropriate number of tokens
      let ownerBalance = await erc1155.balanceOf(OWNER, i);
      expect(ownerBalance.toNumber()).to.equal(INIT_SUPPLY);
    }
  });    

  it('should allow owner to mint tokens to a list of addresses', async () => {
    const INIT_SUPPLY = 10;
    const accounts = await ethers.getSigners();
    const OWNER = accounts[0].address;
    const testAccounts = [
        accounts[1].address,
        accounts[2].address,
        accounts[3].address
    ]

    const ERC1155Opensea = await ethers.getContractFactory("ERC1155Opensea");
    const erc1155 = await ERC1155Opensea.deploy(
        OPENSEA_PROXY_CONTRACT,
        CONTRACT_URI,
        METADATA_URI,
        EXAMPLE_NAME,
        EXAMPLE_SYMBOL
        )

    // create token 0
    await erc1155.create(OWNER, INIT_SUPPLY, "", [])


    // assert that user has the appropriate number of tokens
    let ownerBalance = await erc1155.balanceOf(OWNER, 0);
    expect(ownerBalance.toNumber()).to.equal(INIT_SUPPLY);

    // mint 1 copy of token 0 to each test account, and verify balance
    for (let i = 0; i < testAccounts.length; i++) {
        await erc1155.mint(
            testAccounts[i],
            0,
            1,
            []        
          )

          let balance = await erc1155.balanceOf(testAccounts[i], 0);
          expect(balance.toNumber()).to.equal(1);            
    }
  
    // create token 1
    await erc1155.create(OWNER, INIT_SUPPLY, "", [])

    // mint more than 1 copy of token 1 to each test account, and verify balance
    const tokenAmounts = [
      2,3,4
    ]


    for (let i = 0; i < testAccounts.length; i++) {
        await erc1155.mint(
            testAccounts[i],
            1,
            tokenAmounts[i],
            []        
          )

          let balance = await erc1155.balanceOf(testAccounts[i], 1);
          expect(balance.toNumber()).to.equal(tokenAmounts[i]);            
    }
  });  
});