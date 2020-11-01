pragma solidity ^0.5.11;

import "./ERC1155Tradable.sol";

/**
 * @title MyCollectible
 * MyCollectible - a contract for my semi-fungible tokens.
 */
contract ERC1155Opensea is ERC1155Tradable {

  string internal openseaContractUri;

  constructor(address _proxyRegistryAddress, string memory _contractUri, string memory _metadataUri, string memory _name, string memory _symbol)
  ERC1155Tradable(
    _name,
    _symbol,
    _proxyRegistryAddress
  ) public {
    _setBaseMetadataURI(_metadataUri);
    _setContractURI(_contractUri);
  }

  /**
   * @notice Will update the base URL of token's URI
   * @param _newContractiURI New base URL of token's URI
   */
  function _setContractURI(string memory _newContractiURI) internal {
    openseaContractUri = _newContractiURI;
  }

  function contractURI() public view returns (string memory) {
    return openseaContractUri;
  }
}
