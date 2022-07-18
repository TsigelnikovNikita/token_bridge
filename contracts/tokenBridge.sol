//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 // TODO: don't forget remove this after ending development!
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenBridge is Ownable {
    uint immutable public chainId;
    IERC20 immutable public token;

    constructor(address tokenAddress) {
        chainId = getChainId();
        token = IERC20(tokenAddress);
    }

    function getChainId() private view returns(uint256 chainId_) {
        assembly {
            chainId_ := chainid()            
        }
    }
}
