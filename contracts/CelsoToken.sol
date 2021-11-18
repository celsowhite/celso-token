//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title CelsoToken
 * @author Celso White
 * @notice Buy and transfer the Celso token.
 * @dev Uses open zeppelin standards to setup a custom ERC20 token with some additional functions.
 */
contract CelsoToken is ERC20 {
  // Variables
  uint256 private _initialSupply = 1000;
  uint256 private _tokenValue = 3 ether;

  string private _tokenName = "Celso White Token";
  string private _tokenSymbol = "CELSO";

  /**
   * @dev Sets the token name and symbol. Also mints an initial supply of the token.
   */
  constructor() ERC20(_tokenName, _tokenSymbol) {
    _mint(msg.sender, (_initialSupply * (10**18)));
  }

  /**
   * @dev Buy more Celso tokens.
   * @param quantity The amount of tokens to buy.
   */
  function buyTokens(uint256 quantity) public payable {
    // Calculate the total cost of the tokens based on the quantity requested.
    uint256 totalCost = quantity * _tokenValue;
    require(msg.value == totalCost, "More $$ please.");
    _mint(msg.sender, (quantity * (10**18)));
  }

  /**
   * @return The token value in ether. Setting a getter function rather than a allowing direct access to the public value so other contracts can't change the tokenValue.
   */
  function getTokenValue() public view returns (uint256) {
    return _tokenValue;
  }
}
