// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {

    uint256 constant _totalFullSupply = 50_000_000 * 1e18;
    
    constructor() ERC20("MockToken", "MT") {
        _mint(msg.sender, _totalFullSupply);
    }
}