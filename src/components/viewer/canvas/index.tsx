import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CemStellarium } from '@/cem-stellarium';
import { ACTIONS, useTypedDispatch } from '@/store';
import { dataSource, wasmFile } from './source';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useTypedDispatch();
  const { i18n } = useTranslation();
  const translateFn = useCallback((namespace: string, text: string) => {
    if (i18n.language === 'ko') {
      return i18n.t(text, { lng: i18n.language, ns: namespace, defaultValue: text });
    }
    return text;
  }, [i18n]);

  useEffect(() => {
    if (!canvasRef.current) return;

    CemStellarium.create({
      canvas: canvasRef.current,
      wasmFile: wasmFile,
      dataSource: dataSource,
      translateFn: translateFn,
    }).then((cemStellarium) => {
      dispatch(ACTIONS.common.setCemStellarium(cemStellarium));
    });
  }, []);

  return (
    <CanvasElement ref={canvasRef} />
  )
}

const CanvasElement = styled.canvas`
  flex: 1;
  min-height: 0;
  outline: none;
`;