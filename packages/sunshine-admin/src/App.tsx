import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { useDynamicRouter } from '@/hooks/web/useDynamicRouter';

import { useThemeConfig } from './hooks/setting/useThemeConfig';
import { appInit } from './appInit';

import './App.less';

function App() {
  appInit();

  const { router } = useDynamicRouter();
  const { themeConfig } = useThemeConfig();

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;
