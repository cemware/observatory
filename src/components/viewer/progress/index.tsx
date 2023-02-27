import { ProgressBar } from '@/cem-stellarium/lib';
import { useTypedSelector } from '@/store';
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ProgressMessage } from './progress-message';

export const Progress: React.FC = () => {
  const { cemStellarium } = useTypedSelector((state) => state.common);
  const [progressbars, setProgressbars] = useState<ProgressBar[]>([]);

  const onChangeProgressBars = useCallback((bars: ProgressBar[]) => {
    setProgressbars(bars.sort((a, b) => b.id.localeCompare(a.id)));
  }, []);

  useEffect(() => {
    cemStellarium?.eventManager.on('changeProgressBars', onChangeProgressBars);
    return () => {
      cemStellarium?.eventManager.off('changeProgressBars', onChangeProgressBars);
    }
  }, [cemStellarium]);

  return (
    <ProgressWrap>
      {progressbars.map((progress) => (
        <ProgressMessage key={progress.id} data={progress} />
      ))}
    </ProgressWrap>
  )
}

const ProgressWrap = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`;
