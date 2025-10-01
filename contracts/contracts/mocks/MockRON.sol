// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockRON
 * @dev Mock RON (Riddlen Oracle Network) token for testing
 * Simulates soul-bound reputation tokens with settable balances
 */
contract MockRON {
    mapping(address => uint256) private _balances;

    event BalanceSet(address indexed account, uint256 balance);

    /**
     * @dev Get RON balance for an account
     * @param account Address to check
     * @return RON balance
     */
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev Set RON balance for testing purposes
     * @param account Address to set balance for
     * @param balance New RON balance
     */
    function setBalance(address account, uint256 balance) external {
        _balances[account] = balance;
        emit BalanceSet(account, balance);
    }

    /**
     * @dev Batch set balances for multiple accounts
     * @param accounts Array of addresses
     * @param balances Array of balances
     */
    function setBatchBalances(
        address[] calldata accounts,
        uint256[] calldata balances
    ) external {
        require(accounts.length == balances.length, "Arrays length mismatch");

        for (uint256 i = 0; i < accounts.length; i++) {
            _balances[accounts[i]] = balances[i];
            emit BalanceSet(accounts[i], balances[i]);
        }
    }

    /**
     * @dev Increase RON balance (simulate earning reputation)
     * @param account Address to increase balance for
     * @param amount Amount to increase by
     */
    function increaseBalance(address account, uint256 amount) external {
        _balances[account] += amount;
        emit BalanceSet(account, _balances[account]);
    }

    /**
     * @dev Reset all balances to zero
     * @param accounts Array of addresses to reset
     */
    function resetBalances(address[] calldata accounts) external {
        for (uint256 i = 0; i < accounts.length; i++) {
            _balances[accounts[i]] = 0;
            emit BalanceSet(accounts[i], 0);
        }
    }
}