// import { ModalProps, Modal } from 'antd';
import React from 'react';
import {
  createPortal,
  render as reactRender,
  unmountComponentAtNode as reactUnmount,
} from 'react-dom';

export function withShowModal(Element) {
  function InnerElement(props) {
    return <Element {...props} />;
  }

  function show(config, targetDom) {
    const container = targetDom || document.getElementById('root') || document.body;
    const renderDom = document.createDocumentFragment();

    function render(props) {
      // reactRender(<InnerElement {...props} />, container);
      reactRender(createPortal(<InnerElement {...props} />, container), renderDom);
    }

    function destroy() {
      reactUnmount(renderDom);
    }

    const currentConfig = {
      ...config,
      open: true,
      onCancel: () => {
        render({ open: false, afterClose: destroy });
      },
      onOk: async (params) => {
        const r = typeof config.onOk === 'function' ? config.onOk(params) : undefined;
        render({ open: false, afterClose: destroy });
        return r;
      },
    };

    render(currentConfig);

    return {
      destroy,
    };
  }

  InnerElement.show = show;

  return InnerElement;
}
