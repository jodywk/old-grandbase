// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GrandBase is ERC20, Ownable {

    uint256 constant _totalFullSupply = 50_000_000 * 1e18;
    uint256 private _stakingRewardSupply       = _totalFullSupply * 45 / 100; // 45% = 22_500_000 * 1e18;
    uint256 private _tradingIncentiveSupply    = _totalFullSupply * 20 / 100; // 20% = 10_000_000 * 1e18;
    uint256 public stakingRewardMinted;
    uint256 public tradingIncentiveMinted;

    event MintedStakingReward(address minter, uint256 amount);
    event MintedTradingIncentive(address minter, uint256 amount);

    constructor() ERC20("Grand", "GB") {
        _mint(msg.sender, _totalFullSupply - _stakingRewardSupply - _tradingIncentiveSupply);
    }

    function mintStakingRewards(uint256 amount) external onlyOwner {
        require(stakingRewardMinted + amount <= _stakingRewardSupply, "Already Minted");
        _mint(msg.sender, amount);

        stakingRewardMinted = stakingRewardMinted + amount;

        emit MintedStakingReward(msg.sender, amount);
    }

    function mintTradingIncentive(uint256 amount) external onlyOwner {
        require(tradingIncentiveMinted + amount <= _tradingIncentiveSupply, "Already Minted");
        _mint(msg.sender, amount);

        tradingIncentiveMinted = tradingIncentiveMinted + amount;

        emit MintedTradingIncentive(msg.sender, amount);
    }
}