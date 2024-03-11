import Web3 from 'web3';
import tokenJSON from 'my-contracts/build/Qtum.json';
import exchangeJSON from 'my-contracts/build/Exchange.json';
import { useEffect, useState } from 'react';
import { ETHER_ADDRESS } from '../utils/const'

const useWeb3 = () => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const [account, setAccount] = useState('');
  const [token, setToken] = useState();
  const [exchange, setExchange] = useState();

  const initWeb = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log('accounts: ', accounts);
    setAccount(accounts[0]);

    // 获取networkid
    const networkId = await web3.eth.net.getId();

    const tokenNetWorks = tokenJSON.networks[networkId] ?? {};
    const token = await new web3.eth.Contract(tokenJSON.abi, tokenNetWorks.address);

    const exchange = await new web3.eth.Contract(
      exchangeJSON.abi,
      exchangeJSON.networks[networkId].address,
    );
    setToken(token);
    setExchange(exchange);

    console.log('token信息: ', token);
    console.log('exchange信息: ', exchange);
  };

  useEffect(() => {
    console.log('initWeb3');
    initWeb();
  }, []);

  return {
    web3,
    account,
    token,
    exchange,
    ETHER_ADDRESS
  };
};

export default useWeb3;
