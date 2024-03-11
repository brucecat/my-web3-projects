const ExchangeContracts = artifacts.require('Exchange.sol');
const QtumTokenContracts = artifacts.require('Qtum.sol');
const tools = require('../utils/tools');

module.exports = async function (callback) {
  const accounts = await web3.eth.getAccounts();
  const tokenInstance = await QtumTokenContracts.deployed();
  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
  const exchangeInstance = await ExchangeContracts.deployed();

  // 存以太币
  await exchangeInstance.depositEther({
    from: accounts[0],
    value: tools.toWei(web3, 11),
  });
  const balance1 = await exchangeInstance.tokens(ETHER_ADDRESS, accounts[0]);
  console.log('ether balance: ', tools.fromWei(web3, balance1));

  // 存qtum token
  // 授权
  console.log('exchangeInstance.address', exchangeInstance.address);
  await tokenInstance.approve(exchangeInstance.address, tools.toWei(web3, 100000), {
    from: accounts[0],
  });
  // 存token
  console.log('tokenInstance.address', tokenInstance.address);
  await exchangeInstance.depositToken(tokenInstance.address, tools.toWei(web3, 100000), {
    from: accounts[0],
  });
  const balance = await exchangeInstance.tokens(tokenInstance.address, accounts[0]);
  console.log('token balance: ', tools.fromWei(web3, balance));
  callback();
};
