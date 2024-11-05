// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFaucetToken {
  function mint(address, uint256) external returns (bool);
}

contract Faucet is Ownable {
    /// @notice Creates `_amount` token to `_to`. Must only be called by the authorized.
    function mint(address token, uint256 _amount) external returns (bool) {
        IFaucetToken(token).mint(msg.sender, _amount);
        return true;
    }
}