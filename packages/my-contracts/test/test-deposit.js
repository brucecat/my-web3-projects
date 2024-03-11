const web3 = require('web3');

const ETHER_ADDRESS = '0x28cc7dC8dECE1e555a94E671f0ECA5D7de2a6De1';

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
};

const toWei = (number) => {
  return web3.utils.toWei(String(number), 'ether');
};

module.exports = async (callback) => {
  console.log('callback: ', callback);
  const kerwinToken = await kerwinTokenContract.deployed();
  console.log('kerwinToken: ', kerwinToken);
};
