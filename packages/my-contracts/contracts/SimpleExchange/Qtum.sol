// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Qtum is ERC20 {
    constructor() ERC20("Qtum", "QT") {
        _mint(msg.sender, 100000000000 * 10 ** decimals());
    }
}
