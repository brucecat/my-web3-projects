const fromWei = (web3, bn) => {
  return web3.utils.fromWei(bn, 'ether');
};

const toWei = (web3, number) => {
  return web3.utils.toWei(number.toString(), 'ether');
};


module.exports = {
  fromWei,
  toWei
}