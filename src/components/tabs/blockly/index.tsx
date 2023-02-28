import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BLOCK_CONFIGS, CemBlockly, Language } from '@/cem-blockly';
import { ACTIONS, useTypedDispatch, useTypedSelector } from '@/store';
import { useTranslation } from 'react-i18next';

export const Blockly: React.FC = () => {
  const { cemStellarium, cemBlockly } = useTypedSelector(state => state.common);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useTypedDispatch();
  const { i18n } = useTranslation();

  // const autoSaveBlockly = useCallback(() => {
  //   if (!cemBlockly) return;
  //   const data = cemBlockly.save();
  //   window.localStorage.setItem('tempdata', data);
  // }, [cemBlockly]);

  useEffect(() => {
    if (!ref.current || !cemStellarium) return;
    const cemBlockly = new CemBlockly({
      rootElement: ref.current,
      blockConfigs: BLOCK_CONFIGS,
      language: 'ko',
      cemStellarium,
    });
    cemBlockly.updateLayout();
    cemBlockly.eventManager.on('run', () => {
      cemStellarium.geometry.clear();
    });
    // const tempdata = localStorage.getItem('tempdata');
    // if (tempdata) {
    //   cemBlockly.load(tempdata, true);
    // }
    dispatch(ACTIONS.common.setCemBlockly(cemBlockly));
  }, [cemStellarium]);

  // useEffect(() => {
  //   if (!cemStellarium || !cemBlockly) return;
  //   window.addEventListener('beforeunload', autoSaveBlockly);
  //   cemStellarium.eventManager.on('afterLoad', () => {
  //     window.removeEventListener('beforeunload', autoSaveBlockly);
  //   });
  //   return () => {
  //     window.removeEventListener('beforeunload', autoSaveBlockly);
  //   }
  // }, [cemStellarium, cemBlockly]);

  useEffect(() => {
    cemBlockly?.changeLanguage(i18n.language as Language);
  }, [i18n.language]);

  return (
    <Wrapper ref={ref} />
  )
}

const Wrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
`;