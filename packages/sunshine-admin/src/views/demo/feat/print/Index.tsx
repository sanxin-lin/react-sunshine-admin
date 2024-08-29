import { Button } from 'antd';
import printJS from 'print-js';

import { CollapseContainer } from '@/components/Container';
import { PageWrapper } from '@/components/Page';

const Index = () => {
  const jsonPrint = () => {
    printJS({
      printable: [
        { name: 'll', email: '123@gmail.com', phone: '123' },
        { name: 'qq', email: '456@gmail.com', phone: '456' },
      ],
      properties: ['name', 'email', 'phone'],
      type: 'json',
    });
  };

  const imagePrint = () => {
    printJS({
      printable: [
        'https://anncwb.github.io/anncwb/images/preview1.png',
        'https://anncwb.github.io/anncwb/images/preview2.png',
      ],
      type: 'image',
      header: 'Multiple Images',
      imageStyle: 'width:100%;',
    });
  };

  return (
    <PageWrapper title="打印示例">
      <CollapseContainer title="json打印表格">
        <Button type="primary" onClick={jsonPrint}>
          打印
        </Button>
      </CollapseContainer>

      <Button type="primary" className="mt-5" onClick={imagePrint}>
        Image Print
      </Button>
    </PageWrapper>
  );
};

export default Index;
