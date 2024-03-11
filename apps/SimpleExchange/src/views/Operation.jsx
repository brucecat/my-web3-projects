import { useRef } from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

const Operation = () => {
  const balanceState = useSelector((s) => s.balance);

  const handleOrderCreate = async () => {
    const { default: CreateOrderModal } = await import('../components/CreateOrderModal');
    console.log('CreateOrderModal: ', CreateOrderModal);

    const { destroy } = CreateOrderModal.show({
      title: '创建订单',
      onSuccess: () => {
        destroy();
      },
      balanceState,
    });
  };

  return (
    <div>
      <Button onClick={handleOrderCreate}>创建订单</Button>
    </div>
  );
};

export default Operation;
