import './App.css';
import { ConfigProvider } from 'antd';
import Content from './views/Content';
import { Provider } from 'react-redux';
import store from './redux/store';
// import Web3 from 'web3';

// console.log('token', token);
function App() {
  return (
    <Provider store={store}>
      <ConfigProvider hashPriority='high'>
        <div className='App'>
          <Content></Content>
        </div>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
