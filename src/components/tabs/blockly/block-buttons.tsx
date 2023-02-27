import { EventBlockType } from '@/cem-blockly';
import { useTypedSelector } from '@/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 170px;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  left: 50%;
  bottom: 45px;
  z-index: 10;
  transform: translateX(-50%);
`;

const Button = styled.button`
  width: 50px;
  height: 50px;
  box-shadow: 0px 3px 6px #00000029;
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 18px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: center center;
  border: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  position: relative;

  ::after {
    content: attr(data-tooltip);
    position: absolute;
    top: -10px;
    left: 50%;
    bottom: unset;
    right: unset;
    transform: translate(-50%,-100%);
    color: white;
    background: black;
    padding: 4px 16px;
    border-radius: 100px;
    font-size: 12px;
    white-space: nowrap;
    box-shadow: 0px 1px 3px #000000ed;
    display: none;
  }

  :hover {
    box-shadow: 0px 1px 3px #00000029;
  }
  :hover::after {
    display: inline-block;
  }
`;

const ExcuteButton = styled(Button)`
  background-image: url('/images/icon/blockly-execute.svg');
`;

const StopButton = styled(Button)`
  background-image: url('/images/icon/blockly-stop.svg');
`;

const ExcuteStepButton = styled(Button)`
  background-image: url('/images/icon/blockly-execute-step.svg');
`;

const ExcuteStepAutoButton = styled(Button)`
  background-image: url('/images/icon/blockly-execute-step-auto.svg');
`;


export const BlocklyButtons: React.FC = () => {
  const { cemBlockly } = useTypedSelector(state => state.common);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningStep, setIsRunningStep] = useState(false);
  const { i18n } = useTranslation();

  const onClickExcuteButton = useCallback(() => {
    cemBlockly?.runStartBlocks();
  }, [cemBlockly]);

  const onClickStopButton = useCallback(() => {
    cemBlockly?.stopStartBlock();
  }, [cemBlockly]);

  const onClickStepButton = useCallback(() => {
    cemBlockly?.stepStartBlock();
  }, [cemBlockly]);

  const onClickStepAutoButton = useCallback(() => {
    cemBlockly?.stepStartBlock(true);
  }, [cemBlockly]);

  const onClickStepAutoStopButton = useCallback(() => {
    cemBlockly?.pauseStepAutoStartBlock();
  }, [cemBlockly]);

  const setRunningState = useCallback((running: boolean) => (eventType: EventBlockType) => {
    if (eventType === 'block_start') {
      setIsRunning(running);
    }
  }, []);

  const setStepRunningState = useCallback((running: boolean) => () => {
    setIsRunningStep(running);
  }, []);

  useEffect(() => {
    const runningOn = setRunningState(true);
    const runningOff = setRunningState(false);
    const stepRunningOn = setStepRunningState(true);
    const stepRunningOff = setStepRunningState(false);
    cemBlockly?.eventManager.on('run', runningOn);
    cemBlockly?.eventManager.on('stop', runningOff);
    cemBlockly?.eventManager.on('stepRunAuto', stepRunningOn);
    cemBlockly?.eventManager.on('stepStop', stepRunningOff);
    return () => {
      cemBlockly?.eventManager.off('run', runningOn);
      cemBlockly?.eventManager.off('stop', runningOff);
      cemBlockly?.eventManager.off('stepRunAuto', stepRunningOn);
      cemBlockly?.eventManager.off('stepStop', stepRunningOff);
    };
  }, [cemBlockly, setRunningState, setStepRunningState]);

  const tooltip = useCallback((key: string) => {
    const language = i18n.language
    if (key === 'excute') {
      if (language === 'ko') return '실행';
      if (language === 'en') return 'Run';
    }
    if (key === 'stop') {
      if (language === 'ko') return '정지';
      if (language === 'en') return 'Stop';
    }
    if (key === 'step') {
      if (language === 'ko') return '단계 실행';
      if (language === 'en') return 'Run steps';
    }
    if (key === 'step-auto') {
      if (language === 'ko') return '자동으로 단계 실행';
      if (language === 'en') return 'Run steps automatically';
    }
    if (key === 'step-auto-stop') {
      if (language === 'ko') return '자동실행 정지';
      if (language === 'en') return 'Stop steps';
    }
    return key;
  }, [i18n.language]);

  return (
    <Wrapper>
      <ExcuteStepButton onClick={onClickStepButton} data-tooltip={tooltip('step')} />
      {isRunning ? (
        <StopButton onClick={onClickStopButton} data-tooltip={tooltip('stop')} />
      ) : (
        <ExcuteButton onClick={onClickExcuteButton} data-tooltip={tooltip('excute')} />
      )}
      {isRunningStep ? (
        <StopButton onClick={onClickStepAutoStopButton} data-tooltip={tooltip('step-auto-stop')} />
      ) : (
        <ExcuteStepAutoButton onClick={onClickStepAutoButton} data-tooltip={tooltip('step-auto')} />
      )}
    </Wrapper>
  );
};

export default BlocklyButtons;
