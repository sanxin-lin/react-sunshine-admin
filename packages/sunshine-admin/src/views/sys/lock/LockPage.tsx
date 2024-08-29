import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { LockOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

import headerImg from '@/assets/images/header.jpg';
import { useNow } from '@/hooks/utils/useNow';
import { useDesign } from '@/hooks/web/useDesign';
import { useLocale } from '@/hooks/web/useLocale';
import { useLockStoreActions } from '@/stores/modules/lock';
import { useUserStore, useUserStoreActions } from '@/stores/modules/user';

import './LockPage.less';

const LockPage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setMsg] = useState(false);
  const [showDate, setShowDate] = useState(true);

  const {
    date: { hour, month, minute, meridiem, year, day, week },
  } = useNow(true);
  const { prefixCls } = useDesign('lock-page');
  const { unLock, resetLockInfo } = useLockStoreActions();
  const { logout } = useUserStoreActions();
  const userInfo = useUserStore((state) => state.getUserInfo());
  const { t } = useLocale();

  /**
   * @description: unLock
   */
  const handleUnLock = async () => {
    if (!password) {
      return;
    }
    try {
      setLoading(true);
      const res = await unLock(password);
      setMsg(!res);
    } finally {
      setLoading(false);
    }
  };

  function goLogin() {
    // 主动登出，不带redirect地址
    logout(true);
    resetLockInfo();
  }

  function handleShowForm(show = false) {
    setShowDate(show);
  }

  const onPasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <div
      className={`${prefixCls} fixed inset-0 flex h-screen w-screen bg-black items-center justify-center`}
    >
      <div
        className={`${prefixCls}__unlock absolute top-0 left-1/2 flex pt-5 h-16 items-center justify-center sm:text-md xl:text-xl text-white flex-col cursor-pointer transform translate-x-1/2`}
        onClick={() => handleShowForm(false)}
        style={showDate ? {} : { display: 'none' }}
      >
        <LockOutlined />
        <span>{t('sys.lock.unlock')}</span>
      </div>
      <div className="flex w-screen h-screen justify-center items-center">
        <div className={`${prefixCls}__hour relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5`}>
          <span>{hour}</span>
          <span
            className="meridiem absolute left-5 top-5 text-md xl:text-xl"
            style={showDate ? {} : { display: 'none' }}
          >
            {meridiem}
          </span>
        </div>
        <div className={`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `}>
          <span>{minute}</span>
        </div>
      </div>
      <CSSTransition
        classNames="fade-bottom"
        in={showDate}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className={`${prefixCls}-entry`}>
          <div className={`${prefixCls}-entry-content`}>
            <div className={`${prefixCls}-entry__header enter-x`}>
              <img
                src={userInfo?.avatar || headerImg}
                className={`${prefixCls}-entry__header-img`}
              />
              <p className={`${prefixCls}-entry__header-name`}>{userInfo.realName}</p>
            </div>
            <Input.Password
              placeholder={t('sys.lock.placeholder')}
              className="enter-x"
              onChange={onPasswordChange}
            />
            {errMsg && (
              <span className="`${prefixCls}-entry__err-msg enter-x`">{t('sys.lock.alert')}</span>
            )}
            <div className="`${prefixCls}-entry__footer enter-x`">
              <Button
                type="link"
                size="small"
                className="mt-2 mr-2 enter-x"
                disabled={loading}
                onClick={() => handleShowForm(true)}
              >
                {t('common.back')}
              </Button>
              <Button
                type="link"
                size="small"
                className="mt-2 mr-2 enter-x"
                disabled={loading}
                onClick={goLogin}
              >
                {t('sys.lock.backToLogin')}
              </Button>
              <Button
                className="mt-2"
                type="link"
                size="small"
                onClick={handleUnLock}
                loading={loading}
              >
                {t('sys.lock.entry')}
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <div className="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
        <div className="text-5xl mb-4 enter-x" style={!showDate ? {} : { display: 'none' }}>
          {hour}:{minute} <span className="text-3xl">{meridiem}</span>
        </div>
        <div className="text-2xl">
          {year}/{month}/{day} {week}
        </div>
      </div>
    </div>
  );
};

export default LockPage;
