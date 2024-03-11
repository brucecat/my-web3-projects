import { useCallback, useEffect } from 'react';
import useWeb3 from '../hooks/useWeb3';
import { Spin } from 'antd';
import Balance from './Balance';
import Order from './Order';
import Operation from './Operation';
import { useDispatch } from 'react-redux';
import { loadBalanceData } from '../redux/slices/balanceSlice';
import { loadOrderData } from '../redux/slices/orderSlice';
import { Divider } from 'antd';

const Content = () => {
  const { web3, account, token, exchange, ETHER_ADDRESS } = useWeb3();
  const dispatch = useDispatch();

  const start = useCallback(async () => {
    console.log('-------------调用start初始化-------------');

    // 1. 获取连接后的合约
    dispatch(loadBalanceData({ web3, account, token, exchange, ETHER_ADDRESS }));

    // 2. 获取资产信息
    // 3. 获取订单信息
    dispatch(loadOrderData({ web3, exchange, account }));
  }, [dispatch, web3, account, token, exchange, ETHER_ADDRESS]);

  useEffect(() => {
    if (web3 && exchange && dispatch) {
      start();

      // 监听发出订单事件
      exchange.events.Order({ fromBlock: 0 }, (err, event) => {
        console.log('发出订单事件');
        dispatch(loadOrderData({ web3, exchange, account }));
      });

      // 取消订单
      exchange.events.Cancel({}, (err, event) => {
        console.log('取消订单事件');
        dispatch(loadOrderData({ web3, exchange, account }));
      });

      // 完成订单
      exchange.events.Fill({}, (err, event) => {
        console.log('完成订单事件');
        start();
      });
    }
  }, [web3, exchange, dispatch, start, account]);

  return web3 ? (
    <div>
      <Balance />
      <Divider />
      <Order />
      <Divider />
      <Operation />
    </div>
  ) : (
    <Spin />
  );
};

export default Content;
