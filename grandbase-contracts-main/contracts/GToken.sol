// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GToken is ERC20, Ownable {
    
    address public immutable underlying = 0x0000000000000000000000000000000000000000;
    mapping(address => bool) public authorized;
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    
    /// @notice Creates `_amount` token to `_to`. Must only be called by the authorized.
    function mint(address _to, uint256 _amount) external returns (bool) {
        require(authorized[msg.sender], "Not authorized");
        _mint(_to, _amount);
        return true;
    }
    
    function burn(address _from, uint256 _amount) external returns (bool){
       require(authorized[msg.sender], "Not authorized");
        _burn(_from, _amount);
        return true;
    }
    
    function addAuthorized(address _toAdd) onlyOwner external {
        authorized[_toAdd] = true;
    }

    function removeAuthorized(address _toRemove) onlyOwner external {
        authorized[_toRemove] = false;
    }
    
}