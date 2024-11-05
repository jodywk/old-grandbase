// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface AggregatorV3Interface {
  function latestRoundData(address asset)
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

contract GrandOracle is AggregatorV3Interface, Ownable {
  
  address public oracleManager;

  struct PriceData {
    uint80 roundId;
    int256 answer;
    uint256 startedAt;
    uint256 updatedAt;
    uint80 answeredInRound;
  }

  mapping(address => PriceData) oracleSet;

  event OracleUpdated(address token, uint80 roundId, int256 answer);

  constructor(address _oracleOwner) {
    oracleManager = _oracleOwner;
  }

  modifier onlyOracleManager {
    require(oracleManager == _msgSender(), "Ownable: caller is not the oracleManager");
    _;
  }

  function latestRoundData(address assetAddress)
  external
  view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) {
      PriceData memory priceData = oracleSet[assetAddress];
      return (priceData.roundId, priceData.answer, priceData.startedAt, priceData.updatedAt, priceData.answeredInRound);
    }


  function setOracleManager(address _manager) external onlyOwner {
    oracleManager = _manager;
  }

  function writeRoundData(
    address[] memory addressList,
      uint80[] memory roundIds,
      int256[] memory answers,
      uint256[] memory startedAts,
      uint256[] memory updatedAts,
      uint80[] memory answeredInRounds
  ) external onlyOracleManager {
    for (uint256 i = 0; i < addressList.length; i += 1) {
      PriceData memory data = PriceData({
            roundId: roundIds[i],
            answer: answers[i],
            startedAt: startedAts[i],
            updatedAt:  updatedAts[i],
            answeredInRound: answeredInRounds[i]
      });
      oracleSet[addressList[i]] = data;
      emit OracleUpdated(addressList[i], data.roundId, data.answer);
    }
  }
}