import LogoImg from '@/assets/images/logo.png';
import { CollapseContainer } from '@/components/Container';
import { QrCode, QrCodeActionType } from '@/components/Qrcode';
import { Button } from 'antd';
import { PageWrapper } from '@/components/Page';
import { useRef } from 'react';
import { Nullable } from '#/global';
import { QRCode } from 'antd';

const qrCodeUrl = 'https://ant-design.antgroup.com/';

const QRCodeExample = () => {
  const qrRef = useRef<Nullable<QrCodeActionType>>(null);
  const qrDiyRef = useRef<Nullable<QrCodeActionType>>(null);

  const download = () => {
    const qrEl = qrRef.current;
    if (!qrEl) return;
    qrEl.download('文件名');
  };
  const downloadDiy = () => {
    const qrEl = qrDiyRef.current;
    if (!qrEl) return;
    qrEl.download('Qrcode');
  };

  const onQrcodeDone: any = ({ ctx }: any) => {
    if (ctx instanceof CanvasRenderingContext2D) {
      // 额外绘制
      ctx.fillStyle = 'black';
      ctx.font = '16px "微软雅黑"';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText('你帅你先扫', 100, 195, 200);
    }
  };

  return (
    <PageWrapper title="二维码组件使用示例">
      <div className="flex flex-wrap">
        <CollapseContainer
          title="基础示例"
          canExpand={true}
          className="text-center mb-6 w-1/5 mr-6"
        >
          <QrCode value={qrCodeUrl} />
        </CollapseContainer>

        <CollapseContainer title="渲染成img标签示例" className="text-center mb-6 w-1/5 mr-6">
          <QrCode value={qrCodeUrl} tag="img" />
        </CollapseContainer>

        <CollapseContainer title="配置样式示例" className="text-center mb-6 w-1/5 mr-6">
          <QrCode
            value={qrCodeUrl}
            options={{
              color: { dark: '#55D187' },
            }}
          />
        </CollapseContainer>

        <CollapseContainer title="本地logo示例" className="text-center mb-6 w-1/5 mr-6">
          <QrCode value={qrCodeUrl} logo={LogoImg} />
        </CollapseContainer>

        <CollapseContainer title="在线logo示例" className="text-center mb-6 w-1/5 mr-6">
          <QrCode
            value={qrCodeUrl}
            logo="https://pic1.zhimg.com/v2-e88f553a7a7ba98bae5b00021699800a_1440w.jpg?source=172ae18b"
            options={{
              color: { dark: '#55D187' },
            }}
          />
        </CollapseContainer>

        <CollapseContainer title="logo配置示例" className="text-center mb-6 w-1/5 mr-6">
          <QrCode
            value={qrCodeUrl}
            logo={{
              src: 'https://pic1.zhimg.com/v2-e88f553a7a7ba98bae5b00021699800a_1440w.jpg?source=172ae18b',
              logoSize: 0.2,
              borderSize: 0.05,
              borderRadius: 50,
              bgColor: 'blue',
            }}
          />
        </CollapseContainer>

        <CollapseContainer title="下载示例" className="text-center mb-6 w-1/5 mr-6">
          <QrCode value={qrCodeUrl} ref={qrRef} logo={LogoImg} />
          <Button className="mb-2" type="primary" onClick={download}>
            下载
          </Button>
          <div className="msg">(在线logo会导致图片跨域，需要下载图片需要自行解决跨域问题)</div>
        </CollapseContainer>

        <CollapseContainer title="配置大小示例" className="text-center w-1/5 mr-6">
          <QrCode value={qrCodeUrl} width={300} />
        </CollapseContainer>

        <CollapseContainer title="扩展绘制示例" className="text-center w-1/5 mr-6">
          <QrCode
            value={qrCodeUrl}
            width={200}
            options={{ margin: 5 }}
            ref={qrDiyRef}
            logo={LogoImg}
            onDone={onQrcodeDone}
          />
          <Button className="mb-2" type="primary" onClick={downloadDiy}>
            下载
          </Button>
          <div className="msg">要进行扩展绘制则不能将tag设为img</div>
        </CollapseContainer>

        <CollapseContainer title="Antd QRCode" className="text-center w-1/5 mr-6">
          <QRCode value={qrCodeUrl} size={200} />
        </CollapseContainer>

        <CollapseContainer title="Antd QRCode 带icon" className="text-center w-1/5 mr-6">
          <QRCode value={qrCodeUrl} size={200} icon={LogoImg} />
        </CollapseContainer>
      </div>
    </PageWrapper>
  );
};

export default QRCodeExample;
