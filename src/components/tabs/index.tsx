import React from 'react';
import styled from 'styled-components';
import { useTypedSelector } from '@/store';
import { Blockly } from './blockly';
import BlocklyButtons from './blockly/block-buttons';

export const Tabs: React.FC = () => {
  const { isOpen } = useTypedSelector(state => state.tab);

  return (
    <TabsWrapper data-active={!!isOpen}>
      <TabsContents>
        <Blockly />
        <BlocklyButtons />
      </TabsContents>
    </TabsWrapper>
  )
}

const TabsWrapper = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: row-reverse;
  overflow: hidden;
  height: 100%;
  width: 0;
  transition: width .3s;

  &[data-active="true"] {
    background-color: white;
    width: 600px;
  }
`;

const TabsContents = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: relative;
`;
