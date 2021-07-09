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
  uint256 initialSupply = 1000;
  uint256 tokenValue = 3 ether;
  string tokenName = "Celso White Token";
  string tokenSymbol = "CELSO";

  // Constructor
  constructor() ERC20(tokenName, tokenSymbol) {
    _mint(msg.sender, (initialSupply * (10**18)));
  }

  /**
   * @notice Buy more Celso tokens.
   * @param quantity The amount of tokens you'd like to buy.
   */
  function buyTokens(uint256 quantity) public payable {
    // Calculate the total cost of the tokens based on the quantity requested.
    uint256 totalCost = quantity * tokenValue;
    require(msg.value == totalCost, "More $$ please.");
    _mint(msg.sender, (quantity * (10**18)));
  }
}
