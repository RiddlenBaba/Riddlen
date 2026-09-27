// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RDLNFaucet
 * @notice Testnet only. Hands each wallet a one-time RDLN allowance so strangers can try the game.
 * @dev Holds a plain RDLN balance; never mints. Deploy on Amoy, never on mainnet.
 */
contract RDLNFaucet is Ownable {
    IERC20 public immutable rdln;
    uint256 public claimAmount;
    mapping(address => bool) public claimed;
    uint256 public totalClaims;

    error AlreadyClaimed();
    error FaucetEmpty(uint256 balance);

    event Claimed(address indexed to, uint256 amount);

    constructor(address rdln_, uint256 claimAmount_) Ownable(msg.sender) {
        rdln = IERC20(rdln_);
        claimAmount = claimAmount_;
    }

    function claim() external {
        if (claimed[msg.sender]) revert AlreadyClaimed();
        uint256 balance = rdln.balanceOf(address(this));
        if (balance < claimAmount) revert FaucetEmpty(balance);
        claimed[msg.sender] = true;
        totalClaims++;
        require(rdln.transfer(msg.sender, claimAmount), "transfer failed");
        emit Claimed(msg.sender, claimAmount);
    }

    function canClaim(address who) external view returns (bool) {
        return !claimed[who] && rdln.balanceOf(address(this)) >= claimAmount;
    }

    function setClaimAmount(uint256 amount) external onlyOwner {
        claimAmount = amount;
    }

    function sweep(address to) external onlyOwner {
        require(rdln.transfer(to, rdln.balanceOf(address(this))), "transfer failed");
    }
}
