import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ACTIONS, useTypedDispatch, useTypedSelector } from '@/store';
import { useTranslation } from 'react-i18next';
import { EventBlockType } from '@/cem-blockly';
import { params } from '@/params';

export const Buttons: React.FC = () => {
  const { cemBlockly, executable } = useTypedSelector(state => state.common);
  const isOpenSetting = useTypedSelector(state => state.setting.isOpen);
  const isOpenBlockly = useTypedSelector(state => state.tab.isOpen);
  const [isRunning, setIsRunning] = useState(false);
  const dispatch = useTypedDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const onClickSettingOpenButton = useCallback(() => {
    dispatch(ACTIONS.setting.toggleOpen());
  }, []);

  const onClickBlocklyOpenButton = useCallback(() => {
    dispatch(ACTIONS.tab.toggleOpen());
  }, []);

  const onClickFullscreenButton = useCallback(() => {
    if (!ref.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    ref.current.closest('.body')?.requestFullscreen();
  }, []);

  const onClickBlocklyExecuteButton = useCallback(() => {
    cemBlockly?.runStartBlocks();
  }, [cemBlockly]);

  const onClickBlocklyStopButton = useCallback(() => {
    cemBlockly?.stopStartBlock();
  }, [cemBlockly]);

  const setRunningState = useCallback((running: boolean) => (eventType: EventBlockType) => {
    if (eventType === 'block_start') {
      setIsRunning(running);
    }
  }, []);

  useEffect(() => {
    const runningOn = setRunningState(true);
    const runningOff = setRunningState(false);
    const updateRunnable = (value: boolean) => dispatch(ACTIONS.common.setExcutable(value));
    cemBlockly?.eventManager.on('run', runningOn);
    cemBlockly?.eventManager.on('stop', runningOff);
    cemBlockly?.eventManager.on('changeExecutable', updateRunnable);
    return () => {
      cemBlockly?.eventManager.off('run', runningOn);
      cemBlockly?.eventManager.off('stop', runningOff);
      cemBlockly?.eventManager.off('changeExecutable', updateRunnable);
    };
  }, [cemBlockly, setRunningState]);

  return (
    <ButtonsWrap ref={ref}>
      {!params.noSettingButton && (
        <>
          {isOpenSetting ? (
            <SettingCloseButton onClick={onClickSettingOpenButton} data-active={isOpenSetting} data-tooltip={t('닫기')} />
          ) : (
            <SettingOpenButton onClick={onClickSettingOpenButton} data-active={isOpenSetting} data-tooltip={t('설정')} />
          )}
        </>
      )}
      <BlocklyButtonsWrap>
        {!params.noBlockcodingButton && (
          <>
            {isOpenBlockly ? (
              <BlocklyCloseButton onClick={onClickBlocklyOpenButton} data-active={isOpenBlockly} data-tooltip={t('닫기')} />
            ) : (
              <BlocklyOpenButton onClick={onClickBlocklyOpenButton} data-active={isOpenBlockly} data-tooltip={t('블록코딩 편집')} />
            )}
          </>
        )}
        {!params.noBlockcodingRunButton && (
          <>
            {!isOpenBlockly && executable && !isRunning && (
              <BlocklyExcuteButton onClick={onClickBlocklyExecuteButton} data-active={isOpenBlockly} data-tooltip={t('블록코딩 실행')} />
            )}
            {!isOpenBlockly && executable && isRunning && (
              <BlocklyStopButton onClick={onClickBlocklyStopButton} data-active={isOpenBlockly} data-tooltip={t('블록코딩 실행')} />
            )}
          </>
        )}
      </BlocklyButtonsWrap>
      {!params.noFullscreenButton && (
        <FullscreenButton onClick={onClickFullscreenButton} data-tooltip={t('전체화면')} />
      )}
    </ButtonsWrap>
  )
}

const ButtonsWrap = styled.div``;

const Button = styled.button`
  position: absolute;
  z-index: 1;
  background-color: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border: 0px;
  border-radius: 10px;
  white-space: nowrap;
  background-repeat: no-repeat;
  background-position: center;

  ::after {
    content: attr(data-tooltip);
    position: absolute;
    left: -4px;
    top: 50%;
    padding: 4px 12px;
    width: fit-content;
    font-size: 12px;
    color: white;
    background-color: black;
    border-radius: 50px;
    transform: translate(-100%, -50%);
    display: none;
  }

  :hover::after {
    display: block;
  }
`;

const SettingOpenButton = styled(Button)`
  top: 12px;
  right: 12px;
  background-image: url('/images/icon/setting.svg');
`;

const SettingCloseButton = styled(SettingOpenButton)`
  background-image: url('/images/icon/close.svg');
`;

const FullscreenButton = styled(Button)`
  bottom: 12px;
  right: 12px;
  background-image: url('/images/icon/fullscreen.svg');
  background-size: 20px;
`;

const BlocklyButtonsWrap = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;

  button + button {
    margin-top: 12px;
  }
`;

const BlocklyOpenButton = styled(Button)`
  position: relative;
  top: unset;
  left: unset;
  background-image: url('/images/icon/blockly.svg');

  ::after {
    left: unset;
    right: -4px;
    top: 50%;
    transform: translate(100%, -50%);
  }
`;

const BlocklyCloseButton = styled(BlocklyOpenButton)`
  background-image: url('/images/icon/close.svg');
`;

const BlocklyExcuteButton = styled(BlocklyOpenButton)`
  background-image: url('/images/icon/blockly-execute.svg');
`;

const BlocklyStopButton = styled(BlocklyExcuteButton)`
  background-image: url('/images/icon/blockly-stop.svg');
`;