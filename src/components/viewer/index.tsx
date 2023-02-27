import React from 'react';
import styled from 'styled-components';
import { Buttons } from './buttons';
import { Canvas } from './canvas';
import { ObjectInfo } from './object-info';
import { Progress } from './progress';

export const Viewer: React.FC = () => {
  return (
    <>
      <ViewerWrap className="viewer">
        <Canvas />
        <Buttons />
        <ObjectInfo />
        <Progress />
      </ViewerWrap>
    </>
  );
}

const ViewerWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  position: relative;
`;