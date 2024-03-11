import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const balanceSlice = createSlice({
  name: 'balance', // balance/get..
  initialState: {
    TokenWallet: '0', // wei转换
    TokenExchange: '0',
    EtherWallet: '0', // wei转换
    EtherExchange: '0',

    // 地址信息
    AddressMap: {},
  },
  reducers: {
    setTokenWallet(state, action) {
      state.TokenWallet = action.payload;
    },
    setTokenExchange(state, action) {
      state.TokenExchange = action.payload;
    },
    setEtherWallet(state, action) {
      state.EtherWallet = action.payload;
    },
    setEtherExchange(state, action) {
      state.EtherExchange = action.payload;
    },

    // 更新地址信息
    setAddressMap(state, action) {
      state.AddressMap = { ...state.AddressMap, ...(action.payload || {}) };
    },
  },
});

export const { setTokenWallet, setTokenExchange, setEtherWallet, setEtherExchange, setAddressMap } =
  balanceSlice.actions;
export default balanceSlice.reducer;

export const loadBalanceData = createAsyncThunk(
  'balance/fetchBalanceData',
  async (data, { dispatch }) => {
    // console.log('data', data);
    const { web3, account, token, exchange, ETHER_ADDRESS } = data;

    // 获取钱包本账户的token
    const tokenWallet = await token.methods.balanceOf(account).call();
    // console.log('tokenWallet', tokenWallet);
    dispatch(setTokenWallet(tokenWallet));

    // 获取交易所的token
    const tokenExchange = await exchange.methods.balanceOf(token.options.address, account).call();
    // console.log('tokenExchange', tokenExchange);
    dispatch(setTokenExchange(tokenExchange));

    // 获取钱包的ether
    const etherWallet = await web3.eth.getBalance(account);
    // console.log('etherWallet', etherWallet);
    dispatch(setEtherWallet(etherWallet));

    // 获取交易所的ether
    const etherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    // console.log('etherExchange', etherExchange);
    dispatch(setEtherExchange(etherExchange));

    // 地址信息
    // 当前用户账户地址
    dispatch(
      setAddressMap({
        currentUser: account,
      }),
    );

    // 交易所部署地址
    dispatch(
      setAddressMap({
        exchange: exchange.options.address,
      }),
    );

    // 代币部署地址
    dispatch(
      setAddressMap({
        token: token.options.address,
      }),
    );

    // 以太币地址
    dispatch(
      setAddressMap({
        eth: ETHER_ADDRESS,
      }),
    );
  },
);
