import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { createStore } from '../store';
import { Header } from './header';
import { Settings } from './settings';
import { Viewer } from './viewer';
import { params } from '../params';
import { Tabs } from './tabs';
import { useListenMessage } from './hooks/use-listen-message';
import '../i18n';

const AppComponent: React.FC = () => {
  useListenMessage();
  return (
    <AppWrapper>
      {!params.noHeader && <Header />}
      <Body className="body">
        <Tabs />
        <Viewer />
        <Settings />
      </Body>
    </AppWrapper>
  );
}

export const App: React.FC = () => {
  const store = useMemo(() => createStore(), []);
  return (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  )
}

const AppWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
`;