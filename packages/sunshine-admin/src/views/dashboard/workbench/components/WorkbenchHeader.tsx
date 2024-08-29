import { Avatar } from 'antd';

import headerImg from '@/assets/images/header.jpg';
import { useUserStore } from '@/stores/modules/user';

const WorkbenchHeader = () => {
  const useInfo = useUserStore((state) => state.getUserInfo());

  return (
    <div className="lg:flex">
      <Avatar src={useInfo.avatar || headerImg} size={72} className="!mx-auto !block" />
      <div className="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
        <h1 className="md:text-lg text-md">早安, {useInfo.realName}, 开始您一天的工作吧！</h1>
        <span className="text-secondary"> 今日晴，20℃ - 32℃！ </span>
      </div>
      <div className="flex flex-1 justify-end md:mt-0 mt-4">
        <div className="flex flex-col justify-center text-right">
          <span className="text-secondary"> 待办 </span>
          <span className="text-2xl">2/10</span>
        </div>

        <div className="flex flex-col justify-center text-right md:mx-16 mx-12">
          <span className="text-secondary"> 项目 </span>
          <span className="text-2xl">8</span>
        </div>
        <div className="flex flex-col justify-center text-right md:mr-10 mr-4">
          <span className="text-secondary"> 团队 </span>
          <span className="text-2xl">300</span>
        </div>
      </div>
    </div>
  );
};

export default WorkbenchHeader;
