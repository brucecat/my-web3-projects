export const fromWei = (web3, bn) => {
  return web3.utils.fromWei(bn, 'ether');
};

export const toWei = (web3, number) => {
  return web3.utils.toWei(number.toString(), 'ether');
};
