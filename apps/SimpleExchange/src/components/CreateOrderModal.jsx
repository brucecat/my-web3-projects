import { withShowModal } from '../hooks/useShowModal';
import { Form, Modal, Select, InputNumber, message } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { fromWei, toWei } from '../utils/tools';
import useWeb3 from '../hooks/useWeb3';

const requiredRule = [
  {
    required: true,
    message: '字段不能为空',
  },
];

function ModalApp(props) {
  const { balanceState = {} } = props;
  const { AddressMap = {} } = balanceState;
  const { web3, exchange } = useWeb3();
  const { onSuccess, ...rest } = props;
  const [form] = Form.useForm();

  const tradeOptions = [
    { value: '1', label: '代币->ETH' },
    { value: '2', label: 'ETH->代币' },
  ];

  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    console.log('点击了ok');
    setLoading(true);
    try {
      const vals = await form.validateFields();
      message.info('正在创建订单');
      console.log('vals: ', vals);

      // 拼接创建订单参数
      const orderParams = {
        _tokenGet: vals.tradeType === '1' ? AddressMap.eth : AddressMap.token,
        _amountGet: toWei(web3, vals.receiveAmount),
        _tokenGive: vals.tradeType === '1' ? AddressMap.token : AddressMap.eth,
        _amountGive: toWei(web3, vals.payAmount),
      };
      console.log('orderParams: ', orderParams);
      const orderParamsArr = Object.values(orderParams);
      console.log('orderParamsArr: ', orderParamsArr);

      const testParamList = [
        '0x0000000000000000000000000000000000000000',
        '5000000000000000',
        '0x6D72C6B9C48f270029d31d91b24fb57004a3Ab20',
        '105000000000000000000',
      ];

      //   [
      //     "0x0000000000000000000000000000000000000000",
      //     "1000000000000000000",
      //     "0x6D72C6B9C48f270029d31d91b24fb57004a3Ab20",
      //     "1000000000000000000"
      // ]

      const res = await exchange.methods.makeOrder(...orderParamsArr).send({
        from: AddressMap.currentUser,
      });

      console.log('res: ', res);
      if (res.status) {
        message.success('交易成功');
        onSuccess?.();
      }
    } catch (e) {
      console.log(e);
      message.warning('创建失败');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({});

  const handleValsChange = (changeVal, allVal) => {
    setFormData(allVal);
  };

  const userMaxToken = useMemo(() => {
    return fromWei(web3, balanceState.TokenWallet);
  }, [balanceState, web3]);

  console.log('userMaxToken: ', userMaxToken);

  const userMaxETH = useMemo(() => {
    return fromWei(web3, balanceState.EtherWallet);
  }, [balanceState, web3]);

  return (
    <Modal
      width={600}
      centered
      destroyOnClose
      maskClosable={false}
      {...rest}
      onOk={handleOk}
      okText='确定'
      cancelText='取消'
      okButtonProps={{
        loading: loading,
      }}
    >
      <Form
        onValuesChange={handleValsChange}
        name='createOrderForm'
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{}}
        autoComplete='off'
      >
        <Form.Item
          label='交易方式'
          name='tradeType'
          rules={requiredRule}
        >
          <Select
            className='w-full'
            options={tradeOptions}
          />
        </Form.Item>

        <Form.Item
          label='愿意支付的数额'
          name='payAmount'
          rules={requiredRule}
          extra={
            formData.tradeType === '1' ? `余额：${userMaxToken}代币` : `余额：${userMaxETH}ETH`
          }
        >
          <InputNumber
            className='w-full'
            min={0}
            max={formData.tradeType === '1' ? userMaxToken : userMaxETH}
            addonAfter={formData.tradeType === '1' ? '代币' : 'ETH'}
          />
        </Form.Item>

        <Form.Item
          label='希望收到的数额'
          name='receiveAmount'
          rules={requiredRule}
        >
          <InputNumber
            className='w-full'
            min={0}
            addonAfter={formData.tradeType === '1' ? 'ETH' : '代币'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default withShowModal(ModalApp);
