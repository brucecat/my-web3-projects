const ExchangeContracts = artifacts.require('Exchange.sol');
const QtumTokenContracts = artifacts.require('Qtum.sol');
const tools = require('./utils/tools');

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
};

const toWei = (number) => {
  return web3.utils.toWei(number.toString(), 'ether');
};

module.exports = async function (callback) {
  const accounts = await web3.eth.getAccounts();
  const tokenInstance = await QtumTokenContracts.deployed();
  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
  const exchangeInstance = await ExchangeContracts.deployed();

  // 提取以太币
  let res1 = await exchangeInstance.tokens(ETHER_ADDRESS, accounts[0]);
  console.log(fromWei(res1));

  await exchangeInstance.withdrawEther(toWei(1), {
    from: accounts[0],
  });
  let res2 = await exchangeInstance.tokens(ETHER_ADDRESS, accounts[0]);
  console.log(fromWei(res2));

  // 提取token币

  let res3 = await exchangeInstance.tokens(tokenInstance.address, accounts[0]);
  console.log(fromWei(res3));

  await exchangeInstance.withdrawToken(tokenInstance.address, toWei(5), {
    from: accounts[0],
  });
  let res4 = await exchangeInstance.tokens(tokenInstance.address, accounts[0]);
  console.log(fromWei(res4));

  callback();
};
