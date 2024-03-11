const ExchangeContracts = artifacts.require('Exchange.sol');
const QtumTokenContracts = artifacts.require('Qtum.sol');
const tools = require('../utils/tools');

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
};

const toWei = (number) => {
  return web3.utils.toWei(number.toString(), 'ether');
};
const sleep = (num) => new Promise((resolve) => setTimeout(resolve, num * 1000));
module.exports = async function (callback) {
  const tokenInstance = await QtumTokenContracts.deployed();
  const exchangeInstance = await ExchangeContracts.deployed();

  const accounts = await web3.eth.getAccounts();
  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

  try {
    // 创建订单
    for (let i = 1; i <= 5; i++) {
      await exchangeInstance.makeOrder(
        tokenInstance.address,
        toWei(100 + i),
        ETHER_ADDRESS,
        toWei(i / 1000),
        { from: accounts[0] },
      );
      console.log(`${accounts[0]}:创建第${i}个订单`);
      await sleep(1);
    }

    for (let i = 1; i <= 5; i++) {
      await exchangeInstance.makeOrder(
        tokenInstance.address,
        toWei(100 + i),
        ETHER_ADDRESS,
        toWei(i / 1000),
        { from: accounts[1] },
      );
      console.log(`${accounts[1]}创建第${i}个订单`);
      await sleep(1);
    }
  } catch (err) {
    console.log(err);
  }
  callback();
};
