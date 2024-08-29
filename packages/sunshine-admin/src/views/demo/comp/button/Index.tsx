import { Icon } from '@/components/Icon';
import { PageWrapper } from '@/components/Page';
import { Card, Row, Col, Button } from 'antd';

const ButtonExample = () => {
  return (
    <PageWrapper
      contentFullHeight
      title="基础组件"
      content=" 基础组件依赖于ant-design,组件库已有的基础组件,项目中不会再次进行demo展示（二次封装组件除外）"
    >
      <Row gutter={[20, 20]}>
        <Col xl={10} lg={24}>
          <Card title="BasicButton Color">
            <div className="my-2">
              <div className="text-base font-semibold mb-3">success</div>
              <div className="py-2">
                <Button color="success"> 成功 </Button>
                <Button color="success" className="ml-2" disabled>
                  禁用
                </Button>
                <Button color="success" className="ml-2" loading>
                  loading
                </Button>
                <Button color="success" type="link" className="ml-2">
                  link
                </Button>
                <Button color="success" type="link" className="ml-2" loading>
                  loading link
                </Button>
                <Button color="success" type="link" className="ml-2" disabled>
                  disabled link
                </Button>
              </div>
            </div>

            <div className="my-2">
              <div className="text-base font-semibold mb-3">warning</div>
              <Button color="warning"> 警告 </Button>
              <Button color="warning" className="ml-2" disabled>
                禁用
              </Button>
              <Button color="warning" className="ml-2" loading>
                loading
              </Button>
              <Button color="warning" type="link" className="ml-2">
                link
              </Button>
              <Button color="warning" type="link" className="ml-2" loading>
                loading link
              </Button>
              <Button color="warning" type="link" className="ml-2" disabled>
                disabled link
              </Button>
            </div>

            <div className="my-2">
              <div className="text-base font-semibold mb-3">error</div>
              <Button color="error"> 错误 </Button>
              <Button color="error" className="ml-2" disabled>
                禁用
              </Button>
              <Button color="error" className="ml-2" loading>
                loading
              </Button>
              <Button color="error" type="link" className="ml-2">
                link
              </Button>
              <Button color="error" type="link" className="ml-2" loading>
                loading link
              </Button>
              <Button color="error" type="link" className="ml-2" disabled>
                disabled link
              </Button>
            </div>
            {/* 
            <div className="my-2">
              <div className="text-base font-semibold mb-3">ghost</div>
              <Button ghost className="ml-2">
                幽灵成功
              </Button>
              <Button ghost color="warning" className="ml-2">
                幽灵警告
              </Button>
              <Button ghost color="error" className="ml-2">
                幽灵错误
              </Button>
              <Button ghost type="dashed" color="warning" className="ml-2">
                幽灵警告dashed
              </Button>
              <Button ghost danger className="ml-2">
                幽灵危险
              </Button>
            </div> */}
          </Card>
        </Col>
        <Col xl={14} lg={24}>
          <Card title="BasicButton Types">
            <div className="my-2">
              <div className="text-base font-semibold mb-3">primary</div>
              <Button type="primary" icon={<Icon icon="mdi:page-next-outline" />}>
                主按钮
              </Button>
              <Button type="primary" className="ml-2" disabled>
                禁用
              </Button>
              <Button
                type="primary"
                className="ml-2"
                danger
                icon={<Icon icon="mdi:page-next-outline" />}
              >
                危险
              </Button>
              <Button type="primary" className="ml-2" loading>
                loading
              </Button>
              <Button type="link" className="ml-2">
                link
              </Button>
              <Button type="link" className="ml-2" loading>
                loading link
              </Button>
              <Button type="link" className="ml-2" disabled>
                disabled link
              </Button>
            </div>

            <div className="my-2">
              <div className="text-base font-semibold mb-3">default</div>
              <Button type="default"> 默认 </Button>
              <Button type="default" className="ml-2" disabled>
                禁用
              </Button>
              <Button type="default" className="ml-2" danger>
                危险
              </Button>
              <Button type="default" className="ml-2" loading>
                loading
              </Button>
              <Button type="link" className="ml-2">
                link
              </Button>
              <Button type="link" className="ml-2" loading>
                loading link
              </Button>
              <Button type="link" className="ml-2" disabled>
                disabled link
              </Button>
            </div>

            <div className="my-2">
              <div className="text-base font-semibold mb-3">dashed</div>
              <Button type="dashed"> dashed </Button>
              <Button type="dashed" className="ml-2" disabled>
                禁用
              </Button>
              <Button type="dashed" className="ml-2" danger>
                危险
              </Button>
              <Button type="dashed" className="ml-2" loading>
                loading
              </Button>
            </div>

            <div className="my-2">
              <div className="text-base font-semibold mb-3">
                ghost 常规幽灵按钮通常用于有色背景下
              </div>
              <div className="bg-gray-400 py-2">
                <Button ghost type="primary" className="ml-2">
                  幽灵主要
                </Button>
                <Button ghost type="default" className="ml-2">
                  幽灵默认
                </Button>
                <Button ghost type="dashed" className="ml-2">
                  幽灵dashed
                </Button>
                <Button ghost type="primary" className="ml-2" disabled>
                  禁用
                </Button>
                <Button ghost type="primary" className="ml-2" loading>
                  loading
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default ButtonExample;
