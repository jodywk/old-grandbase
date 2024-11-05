// SPDX-License-Identifier: MIT

//
// Note: You will need to fund each deployed contract with gas.
//
// PingPong sends a LayerZero message back and forth between chains
// a predetermined number of times (or until it runs out of gas).
//
// Demonstrates:
//  1. a recursive feature of calling send() from inside lzReceive()
//  2. how to `estimateFees` for a send()'ing a LayerZero message
//  3. the contract pays the message fee

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title PingPong
/// @notice Sends a LayerZero message back and forth between chains a predetermined number of times.
contract GBMigrator is NonblockingLzApp {

    /// @dev event emitted every ping() to keep track of consecutive pings count
    event GBSend(uint16 dstChainId, uint256 amount, address receiver);
    event GBReceive(uint16 srcChainId, uint256 amount, address receiver);
    event GBWithdraw(uint256 amount, address receiver);

    /// @param _endpoint The LayerZero endpoint address.
    constructor(address _endpoint, address _gbToken) NonblockingLzApp(_endpoint) {
        gbToken = _gbToken;
    }

    /// @notice Send amount of GB token to the destination chain.
    /// @param amount The amount of token on source chain.
    /// @param sendAmount The amount of token on destination chain.
    /// @param _dstChainId The destination chain ID.

    function bridgeToken(
        uint256 amount,
        address receiver,
        uint256 sendAmount,
        uint16 _dstChainId
    ) public payable {
        require(amount != 0 && sendAmount != 0, "Token amount should not be zero");
        require(amount >= sendAmount, "Need to receive smaller amount");

        IERC20 token = IERC20(gbToken);
        // check approve
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");

        // transfer token from sender to contract
        token.transferFrom(msg.sender, address(this), amount);

        // send msg to _dstChainId
        _transfer(_dstChainId, sendAmount, receiver);
    }

    function withdraw(
        uint256 amount
    ) public onlyOwner {
        require(amount != 0, "Token amount should not be zero");

        IERC20 token = IERC20(gbToken);
        token.transfer(msg.sender, amount);

        emit GBWithdraw(amount, msg.sender);
    }

    /// @dev Internal function to send amount of GB tokens to the destination chain.
    /// @param _dstChainId The destination chain ID.
    /// @param sendAmount The amount to transfer.
    /// @param receiver The receiver of the token.
    function _transfer(
        uint16 _dstChainId,
        uint256 sendAmount,
        address receiver
    ) internal {
        require(address(this).balance > 0, "This contract ran out of money.");

        // encode the payload with the number of pings
        bytes memory payload = abi.encode(sendAmount, receiver);

        // encode the adapter parameters
        uint16 version = 1;
        uint256 gasForDestinationLzReceive = 350000;
        bytes memory adapterParams = abi.encodePacked(version, gasForDestinationLzReceive);

        emit GBSend(_dstChainId, sendAmount, receiver);

        // send LayerZero message
        _lzSend(           // {value: messageFee} will be paid out of this contract!
            _dstChainId,   // destination chainId
            payload,       // abi.encode()'ed bytes
            payable(this), // (msg.sender will be this contract) refund address (LayerZero will refund any extra gas back to caller of send())
            address(0x0),  // future param, unused for this example
            adapterParams, // v1 adapterParams, specify custom destination gas qty
            address(this).balance
        );
    }

    /// @dev Internal function to handle incoming Ping messages.
    /// @param _srcChainId The source chain ID from which the message originated.
    /// @param _payload The payload of the incoming message.
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory, /*_srcAddress*/
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
        // decode the number of pings sent thus far
        (uint256 amount, address receiver) = abi.decode(_payload, (uint256, address));

        IERC20 token = IERC20(gbToken);
        // Check balance and token balance
        require(address(this).balance > 0, "This contract ran out of money.");

        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");

        // Transfer token from contract to receiver
        token.transfer(receiver, amount); 

        emit GBReceive(_srcChainId, amount, receiver);
    }

    // allow this contract to receive ether
    receive() external payable {}

    function estimateGasBridgeFee(uint16 _dstChainId, bool _useZro, bytes memory _adapterParams) public view virtual returns (uint nativeFee, uint zroFee) {
        bytes memory payload = abi.encode(msg.sender,0);
        return lzEndpoint.estimateFees(_dstChainId, payable(address(this)), payload, _useZro, _adapterParams);
    }
}