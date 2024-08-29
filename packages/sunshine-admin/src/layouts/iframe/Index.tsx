import { useCreation } from 'ahooks';

import FramePage from './FramePage';
import { useFrameKeepAlive } from './useFrameKeepAlive';

const Index = () => {
  const { framePages, checkHasRenderFrame, checkIsShowIframe, openTabList } = useFrameKeepAlive();

  const showFrame = framePages.length > 0;

  const filterFramePages = useCreation(() => {
    return framePages.filter((frame) => frame.handle.frameSrc && checkHasRenderFrame(frame.id));
  }, [framePages, openTabList]);
  if (!showFrame) return null;

  return (
    <>
      {filterFramePages.map((frame) => (
        <FramePage
          key={frame.id}
          frameSrc={frame.handle.frameSrc}
          style={checkIsShowIframe(frame) ? {} : { display: 'none' }}
        />
      ))}
    </>
  );
};

export default Index;
