const Contracts = artifacts.require('StudentListStorage.sol');

module.exports = async function (callback) {
  console.log('StudentListStorage test');
  const instance = await Contracts.deployed();
  await instance.addList(11, 'x');
  const list = await instance.getList();
  console.log('list', list);
  console.log('index0', await instance.studentList(0));

  callback();
};
