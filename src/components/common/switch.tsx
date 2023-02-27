import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

interface SwitchProps {
  value: boolean;
  onToggle?: (value: boolean) => void;
}
export const Switch: React.FC<SwitchProps> = ({
  value, onToggle,
}) => {
  const [active, setActive] = useState(value);

  const onClick = useCallback(() => {
    setActive(!active);
    if (onToggle) onToggle(!active);
  }, [active]);

  useEffect(() => {
    setActive(value);
  }, [value]);

  return (
    <SwitchWrapper data-active={active} onClick={onClick}>
      <Controller />
    </SwitchWrapper>
  )
}

const SwitchWrapper = styled.div`
  position: relative;
  background-color: #8e9bae;
  border-radius: 15px;
  width: 36px;
  height: 24px;
  transition: .2s;
  cursor: pointer;

  &[data-active="true"] {
    background-color: #feaa01;
  }
`;

const Controller = styled.div`
  display: block;
  position: absolute;
  border-radius: 15px;
  width: 18px;
  height: 18px;
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 2px;
  background-color: white;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  transition: .3s;

  ${SwitchWrapper}[data-active="true"] > & {
    left: 16px;
  }
`;