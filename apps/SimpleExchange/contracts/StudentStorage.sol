// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract StudentStorage {
    uint public age;
    string public username;

    function setData(uint8 _age, string calldata _username) public {
        age = _age;
        username = _username;
    }

    function getAge() public view returns(uint) {
        return age;
    }

    function getUsername() public view  returns(string memory) {
        return username;

    }
}