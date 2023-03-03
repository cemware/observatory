import { IS_DEV } from '@/env';
import { pickLocalFile } from '@/helper/pick-local-file';
import { promptWithModal } from '@/helper/prompt-with-modal';
import { saveAsFile } from '@/helper/save-as-file';
import { useTypedDispatch, useTypedSelector } from '@/store';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetSaveData } from '../hooks/use-get-save-data';
import { useLoadData } from '../hooks/use-load-data';
import { CreditModal } from './credit-modal';

const ext = 'obs';

export const Header: React.FC = () => {
  const { cemStellarium, title } = useTypedSelector(state => state.common);
  const [openCreditModal, setOpenCreditModal] = useState(false);
  const getSaveData = useGetSaveData();
  const loadData = useLoadData();
  const { t } = useTranslation();

  const toggleCreditModal = useCallback(() => {
    setOpenCreditModal(prev => !prev);
  }, []);

  const onClickSaveButton = useCallback(async () => {
    const blob = getSaveData();
    if (!blob) return;
    const timestamp = dayjs().format('YYMMDD');
    const defaultfileName = `Observatory-${timestamp}`;
    let fileName = await promptWithModal({
      description: t('다운로드할 파일 이름을 입력하세요.'),
      defaultValue: title || defaultfileName,
      cancelButtonLabel: t('취소'),
      confirmButtonLabel: t('다운로드'),
      ext,
    });
    if (fileName === null) return;
    fileName = fileName || defaultfileName;
    saveAsFile(blob, `${fileName}.${ext}`);
  }, [getSaveData, t, title]);

  const onClickLoadButton = useCallback(async () => {
    const file = await pickLocalFile(`.${ext}`);
    if (!file) return;
    await loadData(file);
  }, [loadData]);

  const test = useCallback(() => {
    if (!cemStellarium) return;
    cemStellarium.geometry.addText({
      id: 'A',
      coordinates: [0, 0],
      text: 't343t423r2r3',
    })
  }, [cemStellarium]);

  return (
    <HeaderWrapper>
      <Logo src="/images/logo-observatory.svg" />
      <ButtonsWrap>
        <SaveButton data-tooltip={t('파일로 저장')} onClick={onClickSaveButton} />
        <LoadButton data-tooltip={t('파일 불러오기')} onClick={onClickLoadButton} />
        {IS_DEV && <button onClick={test}>test</button>}
      </ButtonsWrap>
      <Title>{title && `${title}.${ext}`}</Title>

      <CreditIcon src="/images/icon/info.svg" onClick={toggleCreditModal} />
      {openCreditModal && <CreditModal closeFn={toggleCreditModal} />}
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  height: 60px;
  background: #282828;
  user-select: none;
  position: relative;
`;

const Logo = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 36px;
  -webkit-user-drag: none;
`;

const CreditIcon = styled.img`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  cursor: pointer;
`;

const Title = styled.div`
  color: white;
  margin-left: 24px;
  font-size: 12px;
`;

const ButtonsWrap = styled.div`
  display: flex;
  margin-left: 16px;
  z-index: 12;
`;

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border: 0px;
  border-radius: 10px;
  white-space: nowrap;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  :hover {
    background-color: #5754e0;
  }

  ::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -4px;
    left: 50%;
    padding: 4px 12px;
    width: fit-content;
    font-size: 12px;
    color: white;
    background-color: black;
    border-radius: 50px;
    transform: translate(-50%, 100%);
    display: none;
  }
  :hover::after {
    display: block;
  }
`;

const SaveButton = styled(Button)`
  background-image: url('/images/icon/save.svg');
`;

const LoadButton = styled(Button)`
  background-image: url('/images/icon/load.svg');
`;