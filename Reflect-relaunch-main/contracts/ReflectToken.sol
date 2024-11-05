// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ReflectToken is ERC20 {

    uint256 constant totalFullSupply = 25_000_000 * 1e18;
    uint256 private communityAirdrop = 6_720_000 * 1e18;
    uint256 private vestingTokens = 10_000_000 * 1e18;
    uint256 private ecosystemTreasury = 4_000_000 * 1e18;
    uint256 private teamTokens = 3_000_000 * 1e18;
    uint256 private mexcHolders = 1_180_000 * 1e18;
    uint256 private initialLiquidity = 100_000 * 1e18;
    
    address public walletCommunityAirdrop = 0xB5f99931076ca65758A4Cdc257bddCcc957971eF;
    address public walletVesting = 0xC265f7e1A020Ef3704aBCa39992D4EC0189d7244;
    address public walletEcosystemTreasury = 0x28acE2a113610083027Ef33D71f0e100cf9240c7;
    address public walletTeamTokens = 0x16Fdf8c559c88cE35ea6B11Ad7Eae8548e2421cE;
    address public walletMexcHolders = 0x39100CA41b272A3861089dB7B2071009294cA9d5;
    address public walletInitialLiquidity = 0x64E373Db34464c817E7B6cf8AFCf6692a58Fa6bD;

    constructor() ERC20("Reflect", "RFL") {
        _mint(walletCommunityAirdrop, communityAirdrop);
        _mint(walletVesting, vestingTokens);
        _mint(walletEcosystemTreasury, ecosystemTreasury);
        _mint(walletTeamTokens, teamTokens);
        _mint(walletMexcHolders, mexcHolders);
        _mint(walletInitialLiquidity, initialLiquidity);
    }
}