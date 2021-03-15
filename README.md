# nft-minter
A Heroku web server to easily mint non-fungible tokens via an API

### Example Configuration: 
* Blockchain: Ethereum
* Testnet: Rinkeby
* Contract: ERC1155 Opensea
* Metadata Hosting: IPFS via Pinata

## Getting Started

### 1. Create .env files with your mnemonic and API keys

```
# .env
MNEMONIC=
INFURA_API_KEY=
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
METADATA_LOCATION=pinata
NETWORK=rinkeby
```

```
# packages/client/.env
REACT_APP_INFURA_API_KEY=
SKIP_PREFLIGHT_CHECK=true
```

```
# packages/server/.env
MNEMONIC=
INFURA_API_KEY=
```


### 2. Create metadata

Edit the examples found under ```/metadata/mono_metadata.json``` and ```/metadata/images```

### 3. Deploy metadata on IPFS

```
yarn metadata:deploy:ipfs 
```

### 4. Deploy smart contract
```
yarn contract:deploy:rinkeby
```

### 5. Run server locally

```
yarn build
yarn serve
```

### 6. Create and mint tokens
go to localhost:3000 to start creating and minting NFTs


### References

* [Observable Article](https://observablehq.com/@polats/web-3-0-explorable-3-nfts-game-items-with-real-world-value) - uses an example game and the included server API to mint NFTs
