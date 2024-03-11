import { Row, Col, Card, Table, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { fromWei } from '../utils/tools';
import useWeb3 from '../hooks/useWeb3';
import { useCallback, useMemo } from 'react';

const Order = () => {
  const { web3, account, exchange = {} } = useWeb3();
  const order = useSelector((s) => s.order);

  const { fillOrders = [], myOrders = [], otherOrders = [] } = order;
  console.log('order slice: ', order);

  // 取消订单
  const handleClickCancel = useCallback(
    async (record) => {
      console.log('handleClickCancel', record);
      try {
        message.info('正在取消');
        await exchange.methods.cancelOrder(record.id).send({
          from: account,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [account, exchange.methods],
  );

  // 完成订单
  const handleClickFill = useCallback(
    async (record) => {
      console.log('handleClickFill', record);
      try {
        message.info('正在进行交易');
        await exchange.methods.fillOrder(record.id).send({
          from: account,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [account, exchange.methods],
  );

  const columns = useMemo(() => {
    return [
      {
        title: '时间',
        dataIndex: 'timestamp',
        render: (text) => new Date(+text * 1000).toLocaleString(),
        width: 170,
      },
      {
        title: '获得的币种',
        dataIndex: 'tokenGet',
        // render: (text) => fromWei(web3, text),
      },
      {
        title: '获得的金额',
        dataIndex: 'amountGet',
        render: (text) => fromWei(web3, text),
      },
      {
        title: '支付的币种',
        dataIndex: 'tokenGive',
        // render: (text) => fromWei(web3, text),
      },
      {
        title: '支付的金额',
        dataIndex: 'tokenGive',

      },
    ];
  }, [web3]);

  const myColumns = useMemo(() => {
    return [
      ...columns,
      {
        title: '操作',
        dataIndex: 'actions',
        render: (text, record) => (
          <Button
            type='primary'
            onClick={() => handleClickCancel(record)}
          >
            取消
          </Button>
        ),
      },
    ];
  }, [columns, handleClickCancel]);

  const otherColumns = useMemo(() => {
    return [
      ...columns,
      {
        title: '操作',
        dataIndex: 'actions',
        render: (text, record) => (
          <Button
            danger
            onClick={() => handleClickFill(record)}
          >
            买入
          </Button>
        ),
      },
    ];
  }, [columns, handleClickFill]);

  return (
    <div className='mt-[20px]'>
      <Row>
        <Col span={24}>
          <Card
            title='已完成交易'
            bordered={false}
            className='m-[5px]'
          >
            <Table
              bordered
              rowKey={(record) => record.id}
              dataSource={fillOrders}
              columns={columns}
              pagination={{
                pageSize: 5,
              }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title='交易中-我的订单'
            className='m-[5px]'
            bordered={false}
          >
            <Table
              bordered
              rowKey={(record) => record.id}
              dataSource={myOrders}
              columns={myColumns}
              pagination={{
                pageSize: 5,
              }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title='交易中-他人订单'
            className='m-[5px]'
            bordered={false}
          >
            <Table
              bordered
              rowKey={(record) => record.id}
              dataSource={otherOrders}
              columns={otherColumns}
              pagination={{
                pageSize: 5,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Order;
