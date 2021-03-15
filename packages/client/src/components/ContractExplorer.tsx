import React, { Fragment, useEffect, useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, 
        Button, CardTitle, CardText, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import classnames from 'classnames';

import { ethers } from "ethers";
import config from '../config';

import * as contractRoot from '../contracts.json';

declare global {
  interface Window {
      ethereum:any;
  }
}

function ContractExplorer() {

  const [activeTab, setActiveTab] = useState('');
  const [web3Provider, setWeb3Provider] = useState(null);
  const [metamaskProvider, setMetamaskProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [readOnlyContract, setReadOnlyContract] = useState(null);
  const [refreshingContract, setRefreshingContract] = useState(false);
  const [contractOwner, setContractOwner] = useState(null);
  const [contractUri, setContractUri] = useState(null);

  const [logText, setLogText] = useState(null);
  const [receiptLink, setReceiptLink] = useState(null);

  const [inProgress, setInProgress] = useState(false);

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  const initializeProvider = () => {

    // display contractRoot
    console.log(contractRoot);

    // initialize provider depending on network
      Object.keys(contractRoot).map(network => {
        let networkName = contractRoot[network].name;
        
        switch (networkName) {
          case "rinkeby":
            let rinkebyProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/" + config.infuraKey);
            let metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
            setWeb3Provider(rinkebyProvider);
            setMetamaskProvider(metamaskProvider);
            setRefreshingContract(true);
          break;
        }
        })
  }

  const refreshContract = async () => {

    let contractAddress, contractAbi, erc1155, metamaskContract;

    Object.keys(contractRoot.contracts).map(contractName => {
      contractAddress = contractRoot.contracts[contractName].address;
      contractAbi = contractRoot.contracts[contractName].abi;
    })

    await window.ethereum.enable()
    erc1155 = new ethers.Contract(contractAddress, contractAbi, web3Provider);
    metamaskContract = new ethers.Contract(contractAddress, contractAbi, metamaskProvider.getSigner());
    
    metamaskContract.on("TransferSingle", (sender, from, to, id, amount, eventInfo) => {
      setLogText("Token id " + id + " created.");
      setReceiptLink("https://rinkeby.etherscan.io/tx/" + eventInfo.transactionHash);
    });

    setReadOnlyContract(erc1155);
    setContract(metamaskContract);

    let contractOwner = await erc1155.owner();
    setContractOwner(contractOwner);

    let contractUri = await erc1155.contractURI();
    setContractUri(contractUri);

    setRefreshingContract(false);
  }

  useEffect(() => {
      setActiveTab(contractRoot.name);

      // on first call, initialize web3Provider
      if (web3Provider === null)
        initializeProvider();
      
      if (refreshingContract)
      {
        refreshContract();
      }
    }, [refreshingContract]);

  const handleCreateToken = async (event) =>
  {
    event.preventDefault(); 
    setInProgress(true);
    const form = event.target;
    const data = new FormData(form);
    let parsedData:any = {};
    for (const [name,value] of data) {
      parsedData[name] = value;
    }

    setLogText("Creating " + parsedData["initialSupply"] + 
               " tokens for address " + parsedData["ownerAddress"] + "...");
    setReceiptLink(null);

    let result;

    try {
    result = await contract.create(
          parsedData["ownerAddress"], 
          parsedData["initialSupply"],
          "", []);
    } catch (e) {
      result = e;
    }

    try {
    setLogText(result.message.toString());
    } catch (e) {}
    setInProgress(false);

  }

  const handleMintToken = async (event) => {
    event.preventDefault(); 
    setInProgress(true);
    const form = event.target;
    const data = new FormData(form);
    let parsedData:any = {};
    for (const [name,value] of data) {
      parsedData[name] = value;
    }

    setLogText("Minting " + parsedData["quantity"] + 
               " of token id " + parsedData["token"] +
               " for address " + parsedData["ownerMintAddress"] + "...");
    setReceiptLink(null);

    let result;

    try {
    result = await contract.mint(
          parsedData["ownerMintAddress"], 
          parsedData["token"],
          parsedData["quantity"],
          []);
    } catch (e) {
      result = e;
    }

    try {
    setLogText(result.message.toString());
    } catch (e) {}
    setInProgress(false);
               
  }

const handleCheckBalance = async (event) => {
  event.preventDefault(); 
  setInProgress(true);
  const form = event.target;
  const data = new FormData(form);
  let parsedData:any = {};
  for (const [name,value] of data) {
    parsedData[name] = value;
  }

  setLogText("Checking balance of token id " + parsedData["tokenToCheck"] +
             " for address " + parsedData["userAddress"] + "...");
  setReceiptLink(null);

  try {

    let result = await readOnlyContract.balanceOf(parsedData["userAddress"], parsedData["tokenToCheck"]);

    setLogText("Balance of token id " + parsedData["tokenToCheck"] +
    " for address " + parsedData["userAddress"] + ": " + result);

  } catch (e) {}

  setInProgress(false);
}

const handleGetMetadata = async (event) => {
  event.preventDefault(); 
  setInProgress(true);
  const form = event.target;
  const data = new FormData(form);
  let parsedData:any = {};
  for (const [name,value] of data) {
    parsedData[name] = value;
  }

  setLogText("Getting metadata of token id " + parsedData["metadata"] + "...");
  setReceiptLink(null);

  try {

    let result = await readOnlyContract.uri(parsedData["metadata"]);
    let metadata = await (await fetch(result)).json();

    setLogText("uri: " + result + "--- " + "metadata: " + JSON.stringify(metadata));

  } catch (e) {}

  setInProgress(false);
}


  return (
    <>
      <Nav tabs>
        {
          Object.keys(contractRoot).map(network => (
            <NavItem key={network}>
              <NavLink
                className={classnames({ active: activeTab === contractRoot[network].name })}
                onClick={() => { toggle(contractRoot[network].name); }}>
                Network: {contractRoot[network].name}
              </NavLink>
            </NavItem>
            )
          )
      }
    </Nav>

    <TabContent activeTab={activeTab}>
        <TabPane tabId={activeTab}>
          {
            Object.keys(contractRoot.contracts).map(contract => (
              <Fragment key={contract}>
                <h5>Contract Name: {contract}</h5>
                <h6>Address: {contractRoot.contracts[contract].address}</h6>
                <h6>Owner: {contractOwner ? contractOwner : "Loading..."}</h6>
                <h6>URI: {contractUri ? contractUri : "Loading..."}</h6>

                <Card>
                  <h5>Create New Token</h5>
                  <Form onSubmit={handleCreateToken}>
                    <FormGroup>
                    <Row>
                    <Col>
                      <Label for="ownerAddressId">Owner Address</Label>
                    </Col>
                    <Col>
                      <Input
                      name="ownerAddress"
                      id="ownerAddressId"
                      placeholder="0x..."
                    />
                    </Col>
                    <Col>
                      <Label for="initialSupplyId">Initial Supply</Label>
                    </Col>
                    <Col>
                      <Input
                        type="number"
                      name="initialSupply"
                      id="initialSupplyId"
                      placeholder="1"
                    />
                    </Col>
                    <Col><Button disabled={inProgress}>Create Token</Button></Col>
                    </Row>
                    </FormGroup>
                  </Form>
                </Card>


                <Card>
                  <h5>Mint Token</h5>
                  <Form onSubmit={handleMintToken}>
                    <FormGroup>
                    <Row>
                    <Col>
                      <Label for="ownerMintAddressId">Owner Address</Label>
                    </Col>
                    <Col>
                      <Input
                      name="ownerMintAddress"
                      id="ownerMintAddressId"
                      placeholder="0x..."
                    />
                    </Col>
                    <Col>
                      <Label for="tokenId">Token Id</Label>
                    </Col>
                    <Col>
                      <Input
                        type="number"
                      name="token"
                      id="tokenId"
                      placeholder="1"
                    />
                    </Col>
                    <Col>
                      <Label for="quantityId">Quantity</Label>
                    </Col>
                    <Col>
                      <Input
                        type="number"
                      name="quantity"
                      id="quantityId"
                      placeholder="1"
                    />
                    </Col>
                    <Col><Button disabled={inProgress}>Mint Token</Button></Col>
                    </Row>
                    </FormGroup>
                  </Form>
                </Card>


                <Card>
                  <h5>Check Token Balance</h5>
                  <Form onSubmit={handleCheckBalance}>
                    <FormGroup>
                    <Row>
                    <Col>
                      <Label for="userAddressId">User Address</Label>
                    </Col>
                    <Col>
                      <Input
                      name="userAddress"
                      id="userAddressId"
                      placeholder="0x..."
                    />
                    </Col>
                    <Col>
                      <Label for="tokenToCheckId">Token Id</Label>
                    </Col>
                    <Col>
                      <Input
                        type="number"
                      name="tokenToCheck"
                      id="tokenToCheckId"
                      placeholder="0"
                    />
                    </Col>
                    <Col><Button disabled={inProgress}>Check Balance</Button></Col>
                    </Row>
                    </FormGroup>
                  </Form>
                </Card>

                <Card>
                  <h5>Get Token Metadata</h5>
                  <Form onSubmit={handleGetMetadata}>
                    <FormGroup>
                    <Row>
                    <Col>
                      <Label for="metadataId">Token Id</Label>
                    </Col>
                    <Col>
                      <Input
                      name="metadata"
                      id="metadataId"
                      placeholder="0"
                    />
                    </Col>
                    <Col><Button disabled={inProgress}>Get Metadata</Button></Col>
                    </Row>
                    </FormGroup>
                  </Form>
                </Card>




                <Card>
                  <h6>Log:</h6>
                  {logText ? logText : ""}
                  {
                    receiptLink ?
                    <a href={receiptLink}>Etherscan</a> : ""
                  }
                </Card>

              </Fragment>
              )
            )
          }
        </TabPane>
      </TabContent>
    </>
  );
}

export {ContractExplorer};