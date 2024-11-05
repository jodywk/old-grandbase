// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract GrandPass is ERC1155, Ownable {
    string public baseURI;
    AggregatorV3Interface internal dataFeed;
    uint256 public launchTimestamp;
    uint256 public constant WHITELIST_PERIOD = 30 minutes;
    bool public finished;

    address[] public whitelist_users = [
        0x431cfEC59772D8D7590f8249E860c904D39Ed867,
        0xdFfCe95E93793E36EF5a6befC59C1b07eec3Ba05,
        0xEbdAC8F71A0c15480F72f345E5b0a2d407aE5273,
        0x5119757E2c791A6De4F3a5Bf38b9fDbfACbd1068,
        0xbE2CE5E3944Ec38CB30A37b6B80d755017A5713F,
        0xAFD644Cd6FaB74C9Ab9444c3E420029D4E6B717A,
        0x2DF6bA8B85C8df3690f0fa9BC965C490c1527096,
        0xadc431bD09777188579d5F3952c637347a3aF1b9,
        0x95f4e0f6062CDfD5E34005C8ACF143b7Ce771ce5,
        0xd6C1960B6497cc938f8f26CDe5BB3A27bd1DF1A9,
        0xFadE8c60893A12E1073044aE350089B9C70d85De,
        0xdB9E736d55Cd55fcf05b9F5eB2c297e10E3BF6ab,
        0x6e74205481C0A61650951a463b18EdD7BCb51e5a,
        0xA48388B4599774ED08C26D437B3d0256D2D30AE8,
        0x6AA1c7Dba4484A78dDc5Bf5FF0f7876B1aCAF329,
        0xD2C8f9501402AB6b0c837810aE7863b04fa6e701,
        0x6d5227DF562a7ECe3811cDC8032f363179c60ffF,
        0xc210204c50e78251689DabE7091Be4d2320F00AB,
        0xC6D4E5C1cd5c2142C4592bBf66766e0f5f588d84,
        0x9d156bc7c8768294510A4A41883d5A4EB15b15E3,
        0x8ac6a89a3484B372aCf4F0De03646C8b2A962911,
        0xc5474C806D76fbDEaeFC20c716fF6D2e7a41c5c8,
        0x8824b4498df76f681E7aF53E947F0571C2f6941f,
        0xC5681832099869B7e612bfA8575f1c0ddD25633C,
        0x0f313De3c9760CD852F30c073334A056f2B7E5BD,
        0xd90F86E8D8B85DDa51307Db17374a2aED5816D84,
        0x1e12c980983bF2f0B9Ca711f977CC99De4226723,
        0x487940C44cd1302db31E671f2001bA79Bd3F5B1C,
        0xB562707b359fDE83025b4C3b7f25d3170078c79a,
        0xDa4e25fC45e82dcDe872c8eaD40a6F012428E1EE,
        0xe755dC26fB680E1A3f977d74421adBE720C5Ccbe,
        0x8B3d832bBf1daC2312068665581D12B19d160D8d,
        0xadd0cb962061c54954601C0C0D7bc1146AAa77bb,
        0x1B99BF9274a745597bEd00C4b9BE2d92777A23E1,
        0x607BFfe1B49a0D9ec0A18d1E80437DE19bE4dc33,
        0x06cE1Cfe93B0BEd56e8e7cC06a4490869d49203c,
        0x604548826D399d506205e46A728Cae01068D1044,
        0x881FdB4d4A30580f07C2c169a327D4D0E2273DfA,
        0x0c3cbaabd5F815BB123Af07CC3f04E74aeCeFF83,
        0x608bBB1f0369C24B5c3F7CBf687fe9E498480e68,
        0x99F5D9E4B88403Fe3590481198396c910610203A,
        0xFdEEFA5eda44DAbd1207FE0D17B2916Ded3280a9,
        0x7508daa0589338Db4df3f98cdFE1B9302b90C80C,
        0xC6582a70bF949B56162461d2598931B96CCE153b,
        0xA5FE86f99e2C97EeD9436cBCbC83d2fEF165EdE5,
        0x7aE564aB0f3851B4ae7136d20D046c66baD00e8D,
        0xF4706DCf9BD49597152262794b70298Ab08D3D32,
        0x1263374E46C55d5212b87ab7913E8fBf4296F8D3
    ];
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public minted;

    mapping(uint256 => uint256) public mintedCounts;
    uint256 public totalMintedCounts;
    uint256 public TOTAL_COUNTS;
    uint256[] public COUNTS = [
        5, 5, 10, 10, 8, 1, 2, 8, 2, 5, 4, 5, 5, 5, 5, 2, 2, 6, 7, 3
    ];

    constructor(string memory uri_, string memory baseURI_) public ERC1155(uri_) {
        baseURI = baseURI_;
        dataFeed = AggregatorV3Interface(0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70); /// ETH/USD
        for(uint i = 0;i < whitelist_users.length; i++) {
            whitelisted[whitelist_users[i]] = true;
        }
        for(uint i = 0;i < COUNTS.length; i++) {
            TOTAL_COUNTS += COUNTS[i];
        }

        launchTimestamp = 1705948200;
        finished = false;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        baseURI = baseURI_;
    }

    function finish(bool finished_, string memory baseURI_) public onlyOwner {
        finished = finished_;
        baseURI = baseURI_;
    }

    function uri(uint256 _tokenid) override public view returns(string memory) {
        if (finished) {
            return string(
                abi.encodePacked(
                    baseURI,
                    Strings.toString(_tokenid),
                    ".json"
                )
            );
        }
        return baseURI;
    }

    function launch() external onlyOwner {
        // require(launchTimestamp == 0, "Already launched!");
        launchTimestamp = block.timestamp;
    }

    function getPrice() public view returns(int256) {
        (,int256 answer,,,) = dataFeed.latestRoundData();
        return answer;
    }

    function mint(address to) external {
        require(finished == false, "Minting finished");
        require(launchTimestamp != 0 && block.timestamp >= launchTimestamp, "Not launched yet!");
        require((block.timestamp > launchTimestamp + WHITELIST_PERIOD) || whitelisted[to], "Not allowed user!");
        require(totalMintedCounts < TOTAL_COUNTS, "Minted all NFTs!");
        require(minted[to] == false, "Can hold only one NFT!");

        uint256 _price = uint256(getPrice());
        uint256 xrand = uint256(keccak256(abi.encodePacked(_price, block.timestamp, to))); /// random number
        uint256 _tokenId = xrand % 20; //// 20 RWA assets
        while(mintedCounts[_tokenId] >= COUNTS[_tokenId]) {
            _tokenId = (_tokenId + 1) % 20;
        }

        _mint(to, _tokenId, 1, "");
        mintedCounts[_tokenId] ++;
        minted[to] = true;
        totalMintedCounts ++;
    }
}