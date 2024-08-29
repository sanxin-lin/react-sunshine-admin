import { CSSTransition } from 'react-transition-group';

import { useLockStore } from '@/stores/modules/lock';

import LockPage from './LockPage';

const Index = () => {
  const lockInfo = useLockStore((state) => state.lockInfo);

  return (
    <CSSTransition
      classNames="fade-bottom"
      in={lockInfo?.isLock}
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      <LockPage />
    </CSSTransition>
  );
};

export default Index;
