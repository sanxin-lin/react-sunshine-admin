import { Loading } from '@/components/Loading';
import { PageWrapper } from '@/components/Page';
import { ThemeEnum } from '@/enums/appEnum';
import { useReactive } from 'ahooks';
import { Alert, Button } from 'antd';
import { useRef } from 'react';

const LoadingExample = () => {
  const wrapEl = useRef<HTMLDivElement>(null);

  const compState = useReactive<{
    absolute?: boolean;
    loading?: boolean;
    theme?: ThemeEnum;
    background?: string;
    tip?: string;
  }>({
    absolute: false,
    loading: false,
    theme: ThemeEnum.DARK,
    background: 'rgba(111,111,111,.7)',
    tip: '加载中...',
  });

  const openLoading = (absolute: boolean) => {
    compState.absolute = absolute;
    compState.loading = true;
    setTimeout(() => {
      compState.loading = false;
    }, 2000);
  };

  const openCompFullLoading = () => {
    openLoading(false);
  };

  const openCompAbsolute = () => {
    openLoading(true);
  };

  const openFnFullLoading = () => {
    const close = Loading.open({
      tip: '加载中...',
    });

    setTimeout(() => {
      close();
    }, 2000);
  };

  const openFnWrapLoading = () => {
    const close = Loading.open({
      tip: '加载中...',
      absolute: true,
      target: wrapEl,
    });

    setTimeout(() => {
      close();
    }, 2000);
  };

  return (
    <PageWrapper title="Loading组件示例">
      <div ref={wrapEl}>
        <Alert message="组件方式" />
        <Button className="my-4 mr-4" type="primary" onClick={openCompFullLoading}>
          全屏 Loading
        </Button>
        <Button className="my-4" type="primary" onClick={openCompAbsolute}>
          容器内 Loading
        </Button>
        <Loading
          loading={compState.loading}
          absolute={compState.absolute}
          theme={compState.theme}
          background={compState.background}
          tip={compState.tip}
        />
        <Alert message="函数方式" />
        <Button className="my-4 mr-4" type="primary" onClick={openFnFullLoading}>
          全屏 Loading
        </Button>
        <Button className="my-4" type="primary" onClick={openFnWrapLoading}>
          容器内 Loading
        </Button>
      </div>
    </PageWrapper>
  );
};

export default LoadingExample;
