import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ACTIONS, useTypedDispatch, useTypedSelector } from '@/store';
import { TimeSetting } from './time-setting';
import { ViewSetting } from './view-setting';
import { useTranslation } from 'react-i18next';

export const Settings: React.FC = () => {
  const isOpen = useTypedSelector(state => state.setting.isOpen);
  const selectedTab = useTypedSelector(state => state.setting.selectedTab);
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();

  const onClickTab = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const tab = e.currentTarget.dataset.value ?? '';
    dispatch(ACTIONS.setting.setSelectedTab(tab));
  }, [dispatch]);

  return (
    <SettingsWrapper data-open={isOpen}>

      <SettingsTabWrapper>
        <SettingTabButton data-value="view" data-active={selectedTab === 'view'} onClick={onClickTab}>
          <img src="/images/icon/view.svg" />
          <span>{t('보기')}</span>
        </SettingTabButton>
        <SettingTabButton data-value="time" data-active={selectedTab === 'time'} onClick={onClickTab}>
          <img src="/images/icon/time.png" />
          <span>{t('시간과 장소')}</span>
        </SettingTabButton>
      </SettingsTabWrapper>

      <SettingsContentsWrapper>
        <SettingsContents data-active={selectedTab === 'view'}>
          <ViewSetting />
        </SettingsContents>
        <SettingsContents data-active={selectedTab === 'time'}>
          <TimeSetting />
        </SettingsContents>
      </SettingsContentsWrapper>

    </SettingsWrapper>
  )
}

const SettingsWrapper = styled.div`
  z-index: 1;
  max-width: 0;
  display: flex;
  flex-direction: row-reverse;
  overflow: hidden;
  transition: .3s ease-out;

  &[data-open="true"] {
    max-width: 400px;
  }
`;

const SettingsTabWrapper = styled.div`
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 5px 0px;
  overflow: hidden auto;
  border-left: 1px solid #c7cdd6;
  background-color: white;
`;

const SettingsContentsWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 300px;
  border-left: 1px solid #c7cdd6;
`;

const SettingsContents = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: none;
  
  &[data-active="true"] {
    display: flex;
    flex-direction: column;
  }
`;

const SettingTabButton = styled.button`
  width: 58px;
  min-height: 58px;
  border: none;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  transition-duration: border-color 0.2s;
  position: relative;
  box-sizing: border-box;
  margin: 4px 0px;
  cursor: pointer;
  opacity: 1;
  border: 2px solid transparent;
  border-radius: 10px;

  > img {
    width: 32px;
    height: 32px;
  }

  > span {
    font-size: 12px;
  }

  &[data-active="true"] {
    border-color: #fec301;
  }
`;