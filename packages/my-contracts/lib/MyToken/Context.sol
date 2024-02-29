// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Context {
    function _msgSender() internal view returns (address) {
        return msg.sender;
    }
}
