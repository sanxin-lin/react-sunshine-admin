import { useState } from 'react';
import { Button, Progress } from 'antd';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  const request = () => {
    setLoading(true);

    fetch('http://localhost:3000/test/data').then(async (response) => {
      if (!response || !response.body) {
        setLoading(false);
        return;
      }

      // 请求头获取 content-length 总长度
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      // 读取数据流
      const reader = response.body.getReader();
      while (1) {
        const { done, value } = await reader.read();

        // done 为 true 说明响应完成
        if (done) {
          setLoading(false);
          break;
        }

        // 累加记载长度
        loaded += value.length;
        // 设置进度
        setPercent(parseInt((loaded / total) * 100, 0));
      }
    });
  };

  // // 监听上传进度
  // xhr.upload.addEventListener('progress', (e) => {
  //   const { loaded, total } = e;
  //   // 获取百分比
  //   console.log(parseInt((loaded / total) * 100, 0));
  // });

  return (
    <div className="flex justify-center items-center">
      <Button loading={loading} type="primary" className="mr-10" onClick={request}>
        Request
      </Button>
      <Progress type="circle" percent={percent} />
    </div>
  );
};

export default Index;

// const request = () => {
//   setLoading(true);

//   const xhr = new XMLHttpRequest();
//   const url = 'http://localhost:3000/test/data';
//   xhr.open('GET', url, true);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       const data = xhr.responseText;
//       setLoading(false);
//     }
//   };

//   // 监听进度
//   xhr.addEventListener('progress', (e) => {
//     const { loaded, total } = e;
//     // 获取百分比
//     setPercent(parseInt((loaded / total) * 100, 0));
//   });

//   xhr.send();
// };
