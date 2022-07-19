//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 // TODO: don't forget remove this after ending development!
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenBridge is Ownable {
    uint immutable public chainId;
    IERC20 immutable public token;

    uint public nonce = 1;

    constructor(address tokenAddress) {
        require(tokenAddress != address(0x0), "TokenBridge: address can't be a zero");

        chainId = getChainId();
        token = IERC20(tokenAddress);
    }


    /**
     * EVENTS
     */

    event Swapped(
        address to,
        uint amount,
        uint nonce,
        uint chainId
    );

    /**
     * FUNCTIONS
     */

    /**
     * @dev Allows you to "transfer" amount of tokens to the another blockchain with `_chainId`
     *
     * @param to address of receipent on the another blockchain
     * @param amount amount of tokens
     * @param _chainId ID of blockchain to wich you want to send tokens
     *
     * Emits {Swapped} event
     */
    function swap(address to, uint amount, uint _chainId) external {
        token.transferFrom(msg.sender, address(this), amount);

        emit Swapped(
            to,
            amount,
            nonce++,
            _chainId
        );
    }

    /**
     * PRIVATE & INTERNAL FUNCTIONS
     */

    function getChainId() private view returns(uint256 chainId_) {
        assembly {
            chainId_ := chainid()            
        }
    }

}
