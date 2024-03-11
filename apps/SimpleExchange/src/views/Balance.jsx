import { useSelector } from 'react-redux';
import { fromWei } from '../utils/tools';
import useWeb3 from '../hooks/useWeb3';
import { Card, Col, Row, Statistic } from 'antd';

const Balance = () => {
  const state = useSelector((s) => s.balance);
  const { web3 } = useWeb3();

  const { AddressMap = {} } = state;

  return (
    <div>
      {/* 地址信息 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <div>当前用户地址</div>
            <div className='break-all'>{AddressMap.currentUser}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <div>交易所地址</div>
            <div className='break-all'>{AddressMap.exchange}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <div>代币地址</div>
            <div className='break-all'>{AddressMap.token}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <div>ETH地址</div>
            <div className='break-all'>{AddressMap.eth}</div>
          </Card>
        </Col>
      </Row>

      {/* 余额信息 */}
      <Row
        gutter={16}
        style={{ marginTop: 20 }}
      >
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <Statistic
              title='钱包中eth:'
              value={fromWei(web3, state.EtherWallet)}
              precision={3}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <Statistic
              title='钱包中token'
              value={fromWei(web3, state.TokenWallet)}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <Statistic
              title='交易所中eth'
              value={fromWei(web3, state.EtherExchange)}
              precision={3}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            bordered={false}
          >
            <Statistic
              title='交易所中token'
              value={fromWei(web3, state.TokenExchange)}
              precision={3}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Balance;
