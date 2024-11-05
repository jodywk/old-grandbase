pragma solidity >=0.6.0;

interface AggregatorV3Interface {

  function decimals() external view returns (uint8);
  function description() external view returns (string memory);
  function version() external view returns (uint256);

  // getRoundData and latestRoundData should both raise "No data present"
  // if they do not have data to report, instead of returning unset values
  // which could be misinterpreted as actual reported values.
  function getRoundData(uint80 _roundId)
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );
  function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );

}
pragma solidity >=0.8.4;

pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IPotionVault {
    function openSafe(uint collateral, uint amount, address gTokenAddress, address collateralAddress) external;
    function closeSafe(uint id) external;
    function depositCollateral(uint id, uint collateral) external;
    function withdrawCollateral(uint id, uint amount) external;
    function burn(uint id, uint amount) external;
    function mint(uint id, uint amount) external;
    function liquidate(uint id, uint amount) external;
}

interface IGToken {
    function mint(address _to, uint256 _amount) external returns (bool);
    function burn(address _from, uint256 _amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}    

contract PotionVault is IPotionVault, Ownable {
    
    using SafeERC20 for IERC20;
    
    struct Safe {
        uint id;
        address payable userAddress;    //  Acccount that created the Safe
        uint collateralAmount;            //  Amount of collateral deposited
        uint mintAmount;                //  Amount of pToken minted
        uint lastInteraction;       // Time of last interaction.
        address collateralAddress;           // Underline contract
        address gTokenAddress;
    }
    
    struct CollateralTokenInfo {
        IERC20 collateralToken;           
        uint underlyingContractDecimals;
        bool canMint;
    }
    
    struct GTokenInfo {
        IGToken gToken;
        address oracle;
        bool canMint;
        bool nasdaqTimer;
        uint minCratio;  // minimum collateral ratio before liquidation. should divide by 10^10. usually 150% = 15000000000
        uint safeCratio; // safe ratio to avoid liquidation. should divide by 10^10. usually 160% = 16000000000
        uint saferCratio; // safer ratio. should divide by 10^10. usually 165% = 16500000000
    }
    
    address public feeCollector;

    bool public canMint = true;
    // bool public nasdaqTimer = true;
    uint public totalSafeCount = 0;
    // uint public minCratio;
    uint public maxCollateralAmount;
    uint public minCollateralAmount;
    uint public maxSafeCountPerUser = 50;
    uint public startTime = 1617595200;

    // mint fee
    uint public mintFeeRatio = 50; // 0.5%
    uint public mintFeeDivide = 10000;

    /// @notice gTokens in platform
    mapping(address => GTokenInfo) public gTokens;
    
    /// @notice collateralTokens in platform
    mapping(address => CollateralTokenInfo) public collateralTokens;
    
    /// @notice safes of a User
    mapping(address => Safe[]) public safesPerUser;

    /// @notice all safes in the platform
    Safe[] public arrSafes;
   
    event Open(address indexed account, uint safeId, uint mintAmount, uint collateralAmount, address indexed gTokenAddress, address indexed collateralAddress);
    event Close(address indexed account, uint indexed safeId);
    event Deposit(address indexed account, uint indexed safeId, uint depositAmount);
    event Withdraw(address indexed account, uint indexed safeId, uint withdrawAmt);
    event Burn(address indexed account, address indexed gTokenAddress, uint indexed safeId, uint burnAmount);
    event Mint(address indexed account, address indexed gTokenAddress, uint indexed safeId, uint mintAmount);
    event Liquidate(address indexed account, address indexed liquidator, uint indexed safeId, uint collateralAmount, uint lqAmountl, uint fee);
    
    constructor(    
        uint _maxCollateralAmount,
        uint _minCollateralAmount,
        address _collector
    ) {
        feeCollector = _collector;
        maxCollateralAmount = _maxCollateralAmount;
        minCollateralAmount = _minCollateralAmount;
    }

    function openSafe(uint collateralAmount, uint mintAmount, address gTokenAddress, address collateralAddress) external override {
        
        GTokenInfo storage gTokenInfo = gTokens[gTokenAddress];
        CollateralTokenInfo storage cTokenInfo = collateralTokens[collateralAddress];
        
        require(gTokenInfo.canMint == true && cTokenInfo.canMint == true && canMint == true, "Market closed");
        require(getNumSafes(msg.sender) <= maxSafeCountPerUser, "Max safes reached");
        
        if (gTokenInfo.nasdaqTimer == true) {
            uint secondsPassed = (block.timestamp - startTime) % 86400;
            require(secondsPassed > 34200 && secondsPassed < 57600 && (block.timestamp - startTime) % 604800 < 432000, "Market closed");
        }

        // check allowance of collateral tokens
        require(collateralAmount <= cTokenInfo.collateralToken.allowance(msg.sender, address(this)), "Allowance not high enough");

        // receive collaterals from user to contract
        cTokenInfo.collateralToken.safeTransferFrom(msg.sender, address(this), collateralAmount);
        
        if (cTokenInfo.underlyingContractDecimals < 1000000000000000000) {
            collateralAmount = collateralAmount * cTokenInfo.underlyingContractDecimals;
        }
        
        // check if collateralAmount is between min and max
        require(collateralAmount >= minCollateralAmount, "Not enough collateral to open");
        require(collateralAmount <= maxCollateralAmount, "Too much collateral to open");
        
        if (mintAmount > 0) {
            // price decimals is 8. (172.69 = 17269000000)
            (, int price, uint startedAt, uint updatedAt, ) = AggregatorV3Interface(gTokenInfo.oracle).latestRoundData();
            require(price > 0 && startedAt > 0 && updatedAt > 0, "Zero is not valid");
            
            uint maxAmount = collateralAmount * 10000000000000000000 / (uint(price) * gTokenInfo.minCratio);
            if (maxAmount % 10 >= 5) {
                maxAmount += 10;
            }
            maxAmount = maxAmount / 10;
            mintAmount = mintAmount > maxAmount ? maxAmount : mintAmount;
        }
        
        Safe memory newSafe = Safe({
            id: totalSafeCount,
            userAddress: payable(msg.sender),
            collateralAmount: collateralAmount,
            mintAmount: mintAmount,
            lastInteraction: block.number,
            collateralAddress: collateralAddress,
            gTokenAddress: gTokenAddress
        });

        arrSafes.push(newSafe);
        safesPerUser[msg.sender].push(newSafe);

        totalSafeCount = totalSafeCount + 1;
        
        if (mintAmount > 0) {

            // take mint fee
            uint mintFee = mintAmount * mintFeeRatio / mintFeeDivide;
            mintAmount = mintAmount - mintFee;

            gTokenInfo.gToken.mint(msg.sender, mintAmount);
        }
        
        emit Open(msg.sender, totalSafeCount, mintAmount, collateralAmount, gTokenAddress, collateralAddress);
    }
    
    function updateSafe(Safe memory safe, uint id) internal {
        // update `arrSafes` array
        arrSafes[id] = safe;

        // update `safesPerUser`
        Safe[] storage userSafes = safesPerUser[safe.userAddress];
        for (uint i = 0; i < userSafes.length; i++) {
            if (userSafes[i].id == safe.id) {
                safesPerUser[safe.userAddress][i] = safe;
                break;
            }
        }
    }
    
    function getNumSafes(address account) public view returns (uint numSafes) {
        return safesPerUser[account].length;
    }

    function getUserSafes(address account) public view returns (Safe[] memory safes) {
        return safesPerUser[account];
    }

    function getLiquidationSafes() public view returns (Safe[] memory safes) {
        Safe[] memory result = new Safe[](arrSafes.length);

        uint j = 0;
        for (uint i = 0; i < arrSafes.length; i ++) {
            Safe memory safe = arrSafes[i];
            GTokenInfo memory gTokenInfo = gTokens[safe.gTokenAddress];
            (, int price, uint startedAt, uint updatedAt, ) = AggregatorV3Interface(gTokenInfo.oracle).latestRoundData();
            if (price > 0 && safe.mintAmount > 0 && safe.collateralAmount * 1000000000000000000 / (safe.mintAmount * uint(price)) < gTokenInfo.minCratio) {
                result[j] = safe;
                j = j + 1;
            }
        }
        
        return result;
    }
    
    function closeSafe(uint id) external override {
        
        require(id < arrSafes.length, "Index is out of bounds");

        Safe memory safe = arrSafes[id];
        
        require(safe.collateralAmount > 0, "Safe closed");
        require(safe.lastInteraction < block.number, "Safe recently interacted with");
        require(msg.sender == safe.userAddress, "Only issuer");
        
        GTokenInfo storage gTokenInfo = gTokens[safe.gTokenAddress];
        
        if (safe.mintAmount > 0) {
            require(gTokenInfo.gToken.balanceOf(msg.sender) >= safe.mintAmount, "Not enough GToken balance");
            gTokenInfo.gToken.burn(msg.sender, safe.mintAmount);
        }
    
        uint collateralAmount = safe.collateralAmount;
        
        safe.mintAmount = 0;
        safe.collateralAmount = 0;
        safe.lastInteraction = block.number;
        updateSafe(safe, id);
        
        CollateralTokenInfo storage cTokenInfo = collateralTokens[safe.collateralAddress];
        
        if (cTokenInfo.underlyingContractDecimals < 1000000000000000000) {
            collateralAmount = collateralAmount * 10 / cTokenInfo.underlyingContractDecimals;
            if (collateralAmount % 10 >= 5) {
                collateralAmount += 10;
            }
            collateralAmount = collateralAmount / 10;
        }
        
        uint fee = collateralAmount / 10;
        if (fee % 10 >= 5) {
            fee += 10;
        }
        fee = fee / 10;        
    
        cTokenInfo.collateralToken.safeTransfer(feeCollector, fee);   
        cTokenInfo.collateralToken.safeTransfer(msg.sender, collateralAmount - fee);  
        
        emit Close(msg.sender, id);
    }    
    
    function depositCollateral(uint id, uint depositAmt) external override {
        
        require(id < arrSafes.length, "id is out of bounds");

        Safe memory safe = arrSafes[id];
        
        CollateralTokenInfo storage cTokenInfo = collateralTokens[safe.collateralAddress];
        
        require(cTokenInfo.canMint == true, "Market closed");
        
        require(depositAmt <= cTokenInfo.collateralToken.allowance(msg.sender, address(this)), "Allowance not high enough");
        cTokenInfo.collateralToken.safeTransferFrom(msg.sender, address(this), depositAmt);
        
        if (cTokenInfo.underlyingContractDecimals < 1000000000000000000) {
            depositAmt = depositAmt * cTokenInfo.underlyingContractDecimals;
        }
        
        require(safe.lastInteraction < block.number, "Safe recently interacted with");
        require(msg.sender == safe.userAddress, "Only issuer");
        require(safe.collateralAmount > 0, "Safe closed");
        require(depositAmt > 1000000000000000000, "Collateral too small");
        require((safe.collateralAmount + depositAmt) <= maxCollateralAmount, "maxAmount collateral reached");
        
        safe.collateralAmount = safe.collateralAmount + depositAmt;
        safe.lastInteraction = block.number;
        updateSafe(safe, id);
        
        emit Deposit(msg.sender, id, depositAmt);
    } 
    
    function withdrawCollateral(uint id, uint withdrawAmt) external override {
        
        require(id < arrSafes.length, "id is out of bounds");

        Safe memory safe = arrSafes[id];
        
        GTokenInfo storage gTokenInfo = gTokens[safe.gTokenAddress];
        CollateralTokenInfo storage cTokenInfo = collateralTokens[safe.collateralAddress];
        
        require(gTokenInfo.canMint == true && canMint == true, "Market closed");
        
        if (gTokenInfo.nasdaqTimer == true) {
            uint secondsPassed = (block.timestamp - startTime) % 86400;
            require(secondsPassed > 34200 && secondsPassed < 57600 && (block.timestamp - startTime) % 604800 < 432000, "Market closed");
        }
        
        require(safe.lastInteraction < block.number, "Safe recently interacted with");
        require(msg.sender == safe.userAddress, "Only issuer");
        require(withdrawAmt > 0, "Cant withdraw 0");
        
        if (cTokenInfo.underlyingContractDecimals < 1000000000000000000) {
            withdrawAmt = withdrawAmt * cTokenInfo.underlyingContractDecimals;
        }
        
        require((safe.collateralAmount - withdrawAmt) >= minCollateralAmount, "Min collateral reached");
    
        (, int price, uint startedAt, uint updatedAt, ) = AggregatorV3Interface(gTokenInfo.oracle).latestRoundData();
        require(price > 0 && startedAt > 0 && updatedAt > 0, "Zero is not valid");
        
        uint maxAmount = ((safe.collateralAmount * 1000000000000000000) - (safe.mintAmount * uint(price) * gTokenInfo.minCratio)) / 100000000000000000;
        
        if (maxAmount % 10 >= 5) {
           maxAmount += 10;
        }
        maxAmount = maxAmount / 10;
        withdrawAmt = withdrawAmt > maxAmount ? maxAmount : withdrawAmt;
        
        safe.collateralAmount = safe.collateralAmount - withdrawAmt;
        safe.lastInteraction = block.number;
        updateSafe(safe, id);
        
        if (cTokenInfo.underlyingContractDecimals < 1000000000000000000) {
            withdrawAmt = withdrawAmt * 10 / cTokenInfo.underlyingContractDecimals;
            if (withdrawAmt % 10 >= 5) {
                withdrawAmt += 10;
            }
            withdrawAmt = withdrawAmt / 10;            
        }
             
        uint fee = withdrawAmt / 10;
        if (fee % 10 >= 5) {
           fee += 10;
        }
        fee = fee / 10;        
        
        cTokenInfo.collateralToken.safeTransfer(feeCollector, fee); 
        cTokenInfo.collateralToken.safeTransfer(msg.sender, withdrawAmt - fee);
        
        emit Withdraw(msg.sender, id, withdrawAmt);
    }
    
    function burn(uint id, uint burnAmt) external override {
    
        require(id < arrSafes.length, "id is out of bounds");

        Safe memory safe = arrSafes[id];
        
        require(safe.collateralAmount > 0, "Safe closed");
        require(safe.lastInteraction < block.number, "Safe recently interacted with");
        require(msg.sender == safe.userAddress, "Only issuer");
        require(burnAmt > 0, "Cant burn zero");
        require(safe.mintAmount >= burnAmt, "Cant burn more");
        
        safe.mintAmount = safe.mintAmount - burnAmt;
        safe.lastInteraction = block.number;
        updateSafe(safe, id);
        
        GTokenInfo storage gTokenInfo = gTokens[safe.gTokenAddress];
        
        require(gTokenInfo.gToken.balanceOf(msg.sender) >= burnAmt, "Not enough GToken balance");
        gTokenInfo.gToken.burn(msg.sender, burnAmt);
        
        emit Burn(msg.sender, safe.gTokenAddress, id, burnAmt);
    }
    
    function mint(uint id, uint amount) external override {
        
        require(id < arrSafes.length, "id is out of bounds");

        Safe memory safe = arrSafes[id];

        GTokenInfo storage gTokenInfo = gTokens[safe.gTokenAddress];
        
        require(gTokenInfo.canMint == true && canMint == true, "Market closed");
        
        if (gTokenInfo.nasdaqTimer == true) {
            uint secondsPassed = (block.timestamp - startTime) % 86400;
            require(secondsPassed > 34200 && secondsPassed < 57600 && (block.timestamp - startTime) % 604800 < 432000, "Market closed");
        }

        require(safe.collateralAmount >= minCollateralAmount, "Min collateral reached");
        require(safe.lastInteraction < block.number, "Safe recently interacted with");
        require(msg.sender == safe.userAddress, "Only issuer");
        require(amount > 0, "Cant mint zero");
        
        (, int price, uint startedAt, uint updatedAt, ) = AggregatorV3Interface(gTokenInfo.oracle).latestRoundData();
        require(price > 0 && startedAt > 0 && updatedAt > 0, "Zero is not valid");
        
        uint maxAmount = ((safe.collateralAmount * 1000000000000000000) - (safe.mintAmount * uint(price) * gTokenInfo.minCratio)) * 10 / (uint(price) * gTokenInfo.minCratio);
        if (maxAmount % 10 >= 5) {
           maxAmount += 10;
        }
        maxAmount = maxAmount / 10;
        amount = amount > maxAmount ? maxAmount : amount;
        
        safe.mintAmount = safe.mintAmount + amount;
        safe.lastInteraction = block.number;
        updateSafe(safe, id);
        
        // take mint fee
        uint mintFee = amount * mintFeeRatio / mintFeeDivide;
        amount = amount - mintFee;

        gTokenInfo.gToken.mint(msg.sender, amount);
        
        emit Mint(msg.sender, address(gTokenInfo.gToken), id, amount);
    }
    
    function liquidate(uint id, uint lqAmount) external override {
        
        require(id < arrSafes.length, "id is out of bounds");

        Safe memory safe = arrSafes[id];

        GTokenInfo storage gTokenInfo = gTokens[safe.gTokenAddress];
        
        require(gTokenInfo.canMint == true && canMint == true, "Market closed");
        
        if (gTokenInfo.nasdaqTimer == true) {
            uint secondsPassed = (block.timestamp - startTime) % 86400;
            require(secondsPassed > 34200 && secondsPassed < 57600 && (block.timestamp - startTime) % 604800 < 432000, "Market closed");
        }
        
        require(safe.collateralAmount > 0, "Safe closed");
        require(safe.lastInteraction < block.number, "Safe recently interacted with");
        require(lqAmount > 0, "Cant burn zero");
        require(safe.mintAmount >= lqAmount, "Cant burn more");
        
        // check gToken price
        (, int price, uint startedAt, uint updatedAt, ) = AggregatorV3Interface(gTokenInfo.oracle).latestRoundData();
        require(price > 0 && startedAt > 0 && updatedAt > 0, "Zero is not valid");
        
        // check liquiation eligibility
        require(safe.collateralAmount * 1000000000000000000 / (safe.mintAmount * uint(price)) < gTokenInfo.minCratio, "Collateral too high");

        // check lqAmount
        {
            (uint lqAmountMin, uint lqAmountMax) = calculateLiquidationAmount(safe, gTokenInfo, uint(price));
            require(lqAmountMin <= lqAmount && lqAmount <= lqAmountMax, "Liquidation Amount is not valid");
        }
        
        // check keeper's gToken balance
        require(gTokenInfo.gToken.balanceOf(msg.sender) >= lqAmount, "Not enough GToken balance");

        // burn keepr's gToken for liquidation
        gTokenInfo.gToken.burn(msg.sender, lqAmount);
        
        // calculate collateral amount to remove from user's safe
        uint collateralToRemove = safe.collateralAmount * lqAmount * 10000000000000000000 / (safe.mintAmount * 1000000000000000000);
            if (collateralToRemove % 10 >= 5) {
                collateralToRemove += 10;
            }
        collateralToRemove = collateralToRemove / 10;
        
        // calculate collateral amount to remove
        CollateralTokenInfo storage cTokenInfo = collateralTokens[safe.collateralAddress];
        
        if (cTokenInfo.underlyingContractDecimals < 1000000000000000000) {
            collateralToRemove = collateralToRemove * 10 / cTokenInfo.underlyingContractDecimals;
            if (collateralToRemove % 10 >= 5) {
                collateralToRemove += 10;
            }
            collateralToRemove = collateralToRemove / 10;            
        }
        
        // calculate & send fee(2%) to feeCollector
        uint fee = collateralToRemove / 5;
        if (fee % 10 >= 5) {
           fee += 10;
        }
        fee = fee / 10;       
        
        collateralToRemove = collateralToRemove - fee;
        
        // send incentives to liquidation keeper as a compensation of burned gAsset
        // gTokenBurnCompensation is 80% of compensation
        uint gTokenBurnCompensation = collateralToRemove * 8;
        if (gTokenBurnCompensation % 10 >= 5) {
           gTokenBurnCompensation += 10;
        }
        gTokenBurnCompensation = gTokenBurnCompensation / 10; 
        
        // sending fees and incentives
        cTokenInfo.collateralToken.safeTransfer(feeCollector, fee);
        cTokenInfo.collateralToken.safeTransfer(msg.sender, gTokenBurnCompensation);

        // remained collaterals which should return to safe
        // collaterals to maintain cratio. (20% of compensation)
        // update the safe to liquidate
        safe.collateralAmount = safe.collateralAmount - fee - gTokenBurnCompensation;
        safe.mintAmount = safe.mintAmount - lqAmount;
        safe.lastInteraction = block.number;
        updateSafe(safe, id);

        emit Liquidate(safe.userAddress, msg.sender, id, collateralToRemove, lqAmount, fee);
    }
    
    function calculateLiquidationAmount(Safe memory _safe, GTokenInfo storage _gTokenInfo, uint _price) internal returns (uint, uint) {
        /*
            (Y * P * CR - X) / ( P*CR - X / Y * 0.804 )

            Y: mintAmount, X: collateralAmount
        */
        uint min = (_safe.mintAmount * _price * _gTokenInfo.safeCratio / 1000000000000000000 - _safe.collateralAmount ) 
            / (_price * _gTokenInfo.safeCratio / 1000000000000000000 - _safe.collateralAmount / _safe.mintAmount * 804 / 1000);

        uint max = (_safe.mintAmount * _price * _gTokenInfo.saferCratio / 1000000000000000000 - _safe.collateralAmount ) 
            / (_price * _gTokenInfo.saferCratio / 1000000000000000000 - _safe.collateralAmount / _safe.mintAmount * 804 / 1000);

        return (min, max);
    }

    function setCanMint(bool _canMint) external onlyOwner {
        canMint = _canMint;
    }
    
    function setFeeCollector(address _collector) external onlyOwner {
        feeCollector = _collector;
    }
    
    function setMinCollateralAmount(uint _minCollateral) external onlyOwner {
        minCollateralAmount = _minCollateral;
    }
    
    function setMaxCollateralAmount(uint _maxCollateralAmount) external onlyOwner {
        maxCollateralAmount = _maxCollateralAmount;
    }
    
    function setStartTime(uint _startTime) external onlyOwner {
        startTime = _startTime;
    }
    
    function setGTokenCanMint(bool _canMint, address gTokenAddy) external onlyOwner {
        gTokens[gTokenAddy].canMint = _canMint;
    }
    
    function setCollateralTokenCanMint(bool _canMint, address cTokenAddy) external onlyOwner {
        collateralTokens[cTokenAddy].canMint = _canMint;
    }
    
    function setGTokenOracle(address _oracle, address gTokenAddy) external onlyOwner {
        gTokens[gTokenAddy].oracle = _oracle;
    }
    
    function mintFeeRatio(uint _mintFeeRatio) external onlyOwner {
        require(_mintFeeRatio > 0, "zero is invalid");
        mintFeeRatio = _mintFeeRatio;
    }
    

    function addCollateralToken(IERC20 _collateralToken, uint256 _underlyingContractDecimals, bool _canMint) external onlyOwner {
        address collateralAddress = address(_collateralToken);
        collateralTokens[collateralAddress] = CollateralTokenInfo({
            collateralToken: _collateralToken,
            underlyingContractDecimals: _underlyingContractDecimals,
            canMint: _canMint
        });
    }
    
    function addGToken(IGToken _gToken, address _oracle, bool _canMint, bool _nasdaqTimer, uint _minCratio, uint _safeCratio, uint _saferCratio) external onlyOwner {
        address gTokenAddress = address(_gToken);
        gTokens[gTokenAddress] = GTokenInfo({
            gToken: _gToken,
            oracle: _oracle,
            canMint: _canMint,
            nasdaqTimer: _nasdaqTimer,
            minCratio: _minCratio,
            safeCratio: _safeCratio,
            saferCratio: _saferCratio
        });
    }
    
}
