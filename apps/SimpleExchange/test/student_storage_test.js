const Contracts = artifacts.require('StudentStorage.sol');

module.exports = async function (callback) {
  console.log(111);
  const instance = await Contracts.deployed();
  await instance.setData(11, 'x');
  const age = await instance.getAge();
  const username = await instance.getUsername();
  console.log('age', age);
  console.log('username', username);

  callback();
};
