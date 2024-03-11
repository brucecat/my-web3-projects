// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract StudentListStorage {


  struct Student {
    uint id;
    uint age;
    string username;
  }

  Student[] public studentList;

  function addList(uint8 _age, string calldata _username) public returns(uint) {
    uint length = studentList.length;
    length += 1;
    Student memory s = Student(length, _age, _username);
    studentList.push(s);
    return length;
  }

  function getList() public view returns(Student[] memory) {
    return studentList;
  }

}
