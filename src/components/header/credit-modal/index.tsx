import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { VERSION } from '../../../env';

interface DescProps {
  name: string;
  homepage: string;
  license?: string;
}
const Desc: React.FC<DescProps> = ({ name, homepage, license }) => {
  const [licenseText, setLicenseText] = useState('');
  const [showLicenseText, setShowLicenseText] = useState(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLicenseText(e.currentTarget.checked);
  }, []);

  useEffect(() => {
    if (license && showLicenseText && !licenseText) {
      const url = `/license/license.${license}.txt`;
      fetch(url).then(res => res.text()).then((result) => {
        setLicenseText(result);
      });
    }
  }, [license, showLicenseText, licenseText]);

  return (
    <Dd>
      <ContentsWrap>
        <Anchor href={homepage} target="_blank" rel="noopener">
          {name}
          <img src="/images/icon/share.svg" width="14" />
        </Anchor>
        {showLicenseText && (
          <textarea readOnly defaultValue={licenseText} />
        )}
      </ContentsWrap>
      <AnchorsWrap>
        {license && (
          <Label>
            <input type="checkbox" checked={showLicenseText} onChange={onChange} />
            <span>license</span>
          </Label>
        )}
      </AnchorsWrap>
    </Dd>
  );
}

interface CreditModalProps {
  closeFn?: () => void;
}
export const CreditModal: React.FC<CreditModalProps> = ({ closeFn }) => {
  const onClickOverlay = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      closeFn && closeFn();
    }
  }, [closeFn]);

  return (
    <Overlay onClick={onClickOverlay}>
      <ModalWrapper>
        <Title>Credits</Title>

        <Dl>
          <Desc
            name="Copyright © 2023 CEMWARE Inc. All rights reserved."
            homepage="https://github.com/cemware/observatory"
          />
        </Dl>
        <Dl>
          <Dt>Open sources</Dt>
          <Desc
            name="acorn"
            homepage="https://github.com/acornjs/acorn"
            license={'acorn'}
          />
          <Desc
            name="blockly"
            homepage="https://github.com/google/blockly"
            license={'blockly'}
          />
          <Desc
            name="dayjs"
            homepage="https://github.com/iamkun/dayjs"
            license={'dayjs'}
          />
          <Desc
            name="events"
            homepage="https://github.com/browserify/events"
            license={'events'}
          />
          <Desc
            name="i18next"
            homepage="https://github.com/i18next/i18next"
            license={'i18next'}
          />
          <Desc
            name="leaflet"
            homepage="https://github.com/Leaflet/Leaflet"
            license={'leaflet'}
          />
          <Desc
            name="lodash"
            homepage="https://github.com/lodash/lodash"
            license={'lodash'}
          />
          <Desc
            name="lz-string"
            homepage="https://github.com/pieroxy/lz-string"
            license={'lz-string'}
          />
          <Desc
            name="react"
            homepage="https://github.com/facebook/react"
            license={'react'}
          />
          <Desc
            name="react-i18next"
            homepage="https://github.com/i18next/react-i18next"
            license={'react-i18next'}
          />
          <Desc
            name="react-leaflet"
            homepage="https://github.com/PaulLeCam/react-leaflet"
            license={'react-leaflet'}
          />
          <Desc
            name="react-redux"
            homepage="https://github.com/reduxjs/react-redux"
            license={'react-redux'}
          />
          <Desc
            name="redux-toolkit"
            homepage="https://github.com/reduxjs/redux-toolkit"
            license={'redux-toolkit'}
          />
          <Desc
            name="stellarium-web-engine"
            homepage="https://github.com/Stellarium/stellarium-web-engine"
            license={'stellarium-web-engine'}
          />
          <Desc
            name="styled-components"
            homepage="https://github.com/styled-components/styled-components"
            license={'styled-components'}
          />
        </Dl>


        <CloseButton onClick={closeFn}>Close</CloseButton>
        <Version>{`v ${VERSION}`}</Version>
      </ModalWrapper>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrapper = styled.div`
  width: 600px;
  background-color: #383838ba;
  padding: 12px 24px;
  border-radius: 8px;
  user-select: text;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
`;

const Title = styled.div`
  margin-top: 12px;
  font-size: 22px;
  text-align: center;
  font-weight: bold;
`;

const Dl = styled.dl`
  max-height: 40vh;
  overflow: auto;
  padding-right: 16px;
`;

const Dt = styled.dt`
  font-size: 14px;
`;

const Dd = styled.dd`
  font-size: 12px;
  word-break: break-all;
  display: flex;
  align-items: flex-start;
  margin: 8px 0px;
  margin-left: 12px;
  position: relative;
`;

const ContentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  align-items: flex-start;

  textarea {
    align-self: stretch;
    overflow: auto;
    font-size: 10px;
    font-family: cursive;
    min-height: 200px;
    resize: none;
    border: none;
    outline: none;
    border-radius: 3px;
    background: white;
    color: black;
    padding: 12px;
    margin: 12px 0;
  }
`;

const AnchorsWrap = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  white-space: nowrap;
  position: absolute;
  top: 0;
  right: 0;
`;

const Anchor = styled.a`
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;

  :hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  margin-left: auto;
  padding: 4px 12px;
  font-size: 12px;
  border: none;
  outline: none;
  background: transparent;
  color: #a7a7a7;
  cursor: pointer;

  :hover {
    color: white;
  }
`;

const Version = styled.div`
  position: absolute;
  bottom: 20px;
  left: 25px;
  font-size: 12px;
`;

const Label = styled.label`
  input {
    display: none;
  }

  span {
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
    font-size: 10px;
  }

  input + span::before {
    content: 'show ';
  }
  input:checked + span::before {
    content: 'hide ';
  }
`;