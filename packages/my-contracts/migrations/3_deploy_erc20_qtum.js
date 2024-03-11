const Contracts = artifacts.require('Qtum.sol');

// const Contracts = actifacts.require("StudentStorage.sol");

module.exports = async function (deployer) {
  // console.log('accounts', accounts);
  // { overwrite: false } 可能会有问题
  deployer.deploy(Contracts /*, { overwrite: false } */);
};
