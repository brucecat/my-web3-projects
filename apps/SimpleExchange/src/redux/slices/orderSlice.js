import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderStateEnum } from '../../utils/const';
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    fillOrders: [],
    myOrders: [],
    otherOrders: [],
  },
  reducers: {
    setOrders(state, action) {
      const { allOrders = [], fillOrders = [], myOrders = [], otherOrders = [] } = action.payload;
      console.log('state.payload: ', state.payload);

      // 更新所有订单
      state.orders = allOrders;
      state.fillOrders = fillOrders;
      state.myOrders = myOrders;
      state.otherOrders = otherOrders;
    },
  },
});

export const { setOrders } = orderSlice.actions;

// 获取订单数据
export const loadOrderData = createAsyncThunk(
  'order/fetchOrderData',
  async (data, { dispatch }) => {
    const { exchange, account } = data;

    // 获取交易所的orders
    const allOrdersInfo = await exchange.methods.getAllOrders().call();
    console.log('allOrdersInfo: ', allOrdersInfo);

    const allOrders = allOrdersInfo.filter((o) => o.id !== '0');

    // 同步更新各类订单信息
    // 已完成的订单
    const fillOrders = allOrders.filter((o) => o.orderState === OrderStateEnum.Fill);

    // 我创建的订单
    const myOrders = allOrders.filter(
      (o) => o.orderState === OrderStateEnum.Create && o.user === account,
    );

    // 其他人创建的订单
    const otherOrders = allOrders.filter(
      (o) => o.orderState === OrderStateEnum.Create && o.user !== account,
    );

    const res = {
      allOrders,
      fillOrders,
      myOrders,
      otherOrders,
    };

    console.log('订单信息汇总: ', res);

    // 同步到state里
    dispatch(setOrders(res));
  },
);

export default orderSlice.reducer;
