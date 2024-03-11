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
    // 第1步 accounts[0] 转 accounts[1] 10w qt
    await tokenInstance.transfer(accounts[1], toWei(100000), { from: accounts[0] });

    // 第2.1步 account[0] 存入 交易所 2 eth
    await exchangeInstance.depositEther({
      from: accounts[0],
      value: toWei(2),
    });

    const res1 = await exchangeInstance.tokens(ETHER_ADDRESS, accounts[0]);
    console.log('accounts[0]在交易所中的以太币', fromWei(res1));

    // 第2.2步 account[0] 存入 交易所 10w qt
    await tokenInstance.approve(exchangeInstance.address, toWei(100000), { from: accounts[0] });
    await exchangeInstance.depositToken(tokenInstance.address, toWei(100000), {
      from: accounts[0],
    });

    const res2 = await exchangeInstance.tokens(tokenInstance.address, accounts[0]);
    console.log('accounts[0]在交易所中的token', fromWei(res2));

    // 第3.1步 account[1] 存入 交易所 3 eth

    await exchangeInstance.depositEther({
      from: accounts[1],
      value: toWei(3),
    });

    const res3 = await exchangeInstance.tokens(ETHER_ADDRESS, accounts[1]);
    console.log('accounts[1]在交易所中的以太币', fromWei(res3));

    // 第3.2步 account[1] 存入 交易所 5w qt
    await tokenInstance.approve(exchangeInstance.address, toWei(50000), { from: accounts[1] });
    await exchangeInstance.depositToken(tokenInstance.address, toWei(50000), { from: accounts[1] });

    const res4 = await exchangeInstance.tokens(tokenInstance.address, accounts[1]);
    console.log('accounts[1]在交易所中的token', fromWei(res4));

    // accounts[0]在交易所中的以太币 2
    // accounts[0]在交易所中的token 100000
    // accounts[1]在交易所中的以太币 3
    // accounts[1]在交易所中的token 50000

    let orderId = 0;
    let res;

    // 创建订单
    res = await exchangeInstance.makeOrder(
      tokenInstance.address,
      toWei(1000),
      ETHER_ADDRESS,
      toWei(0.1),
      { from: accounts[0] },
    );
    orderId = res.logs[0].args.id;
    console.log('创建了一个订单1， res:', res);
    console.log('创建了一个订单1， orderId:', orderId);

    sleep(3);
    res = await exchangeInstance.makeOrder(
      tokenInstance.address,
      toWei(2000),
      ETHER_ADDRESS,
      toWei(0.2),
      { from: accounts[0] },
    );
    orderId = res.logs[0].args.id;
    console.log('创建了一个订单2， res:', res);
    console.log('创建了一个订单2， orderId:', orderId);
    sleep(3);

    // 取消订单
    console.log('准备取消一个订单， orderId:', orderId);
    res = await exchangeInstance.cancelOrder(orderId, { from: accounts[0] });
    console.log('已取消一个订单， orderId:', orderId);
    sleep(3);

    // 创建订单
    res = await exchangeInstance.makeOrder(
      tokenInstance.address,
      toWei(3000),
      ETHER_ADDRESS,
      toWei(0.3),
      { from: accounts[0] },
    );
    orderId = res.logs[0].args.id;
    console.log('创建了一个订单3， res:', res);
    console.log('创建了一个订单3， orderId:', orderId);

    // 完成订单
    res = await exchangeInstance.fillOrder(orderId, { from: accounts[1] });
    console.log('完成了一个订单， res:', res);
    console.log('完成了一个订单， orderId:', orderId);

    console.log(
      'accounts[0]在交易所的token',
      fromWei(await exchangeInstance.tokens(tokenInstance.address, accounts[0])),
    );
    console.log(
      'accounts[0]在交易所的eth',
      fromWei(await exchangeInstance.tokens(ETHER_ADDRESS, accounts[0])),
    );

    console.log(
      'accounts[1]在交易所的token',
      fromWei(await exchangeInstance.tokens(tokenInstance.address, accounts[1])),
    );
    console.log(
      'accounts[1]在交易所的eth',
      fromWei(await exchangeInstance.tokens(ETHER_ADDRESS, accounts[1])),
    );
    // accounts[0]在交易所的token 103300
    // accounts[0]在交易所的eth 1.7
    // accounts[1]在交易所的token 46700
    // accounts[1]在交易所的eth 3.3
  } catch (err) {
    console.log(err);
  }
  callback();
};
