const ExchangeContracts = artifacts.require('Exchange.sol');

// const Contracts = actifacts.require("StudentStorage.sol");

module.exports = async function (deployer, network, accounts) {
  // promise 部署出错
  // const accounts = await web3.eth.getAccounts();
  console.log('network', network);

  // console.log('accounts', accounts, accounts[0]);
  deployer.deploy(ExchangeContracts, accounts[0], 10);
  // 0x28cc7dC8dECE1e555a94E671f0ECA5D7de2a6De1
};
