//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// TODO: don't forget remove this after ending development!
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenBridge is Ownable {
    uint256 public immutable chainId;
    IERC20 public immutable token;

    uint256 public nonce = 1;

    mapping(bytes32 => bool) private handledMessages;

    constructor(address tokenAddress) {
        require(tokenAddress != address(0x0), "TokenBridge: address can't be a zero");

        chainId = getChainId();
        token = IERC20(tokenAddress);
    }

    /**
     * EVENTS
     */

    event SwapInitialized(address to, uint256 amount, uint256 nonce, uint256 chainId);

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
     * Emits {SwapInitialized} event
     */
    function swap(
        address to,
        uint256 amount,
        uint256 _chainId
    ) external {
        token.transferFrom(msg.sender, address(this), amount);

        emit SwapInitialized(to, amount, nonce++, _chainId);
    }

    function reedem(
        address to,
        uint256 amount,
        uint256 _nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        bytes32 message = keccak256(abi.encodePacked(to, amount, _nonce, chainId, address(this)));
        require(!handledMessages[message], "TokenBridge: message is already handled");

        address addr = ecrecover(addHashPrefix(message), v, r, s);
        require(addr == owner(), "TokenBridge: incorrect signature");

        handledMessages[message] = true;
        token.transfer(to, amount);
    }

    /**
     * PRIVATE & INTERNAL FUNCTIONS
     */

    function getChainId() private view returns (uint256 chainId_) {
        assembly {
            chainId_ := chainid()
        }
    }

    function addHashPrefix(bytes32 message) private pure returns (bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(abi.encodePacked(prefix, message));
    }
}
