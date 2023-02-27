import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface InputRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const InputRadio = forwardRef<HTMLInputElement, InputRadioProps>(({
  children, ...props
}, ref) => {
  return (
    <Label>
      <InputElement
        ref={ref}
        type="radio"
        {...props}
      />
      <RadioIcon />
      {children}
    </Label>
  )
})

const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
`;

const InputElement = styled.input`
  display: none;
`;

const RadioIcon = styled.div`
  width: 18px;
  height: 18px;
  background-color: white;
  border: 1px solid rgb(199, 205, 214);
  border-radius: 50%;
  position: relative;
  margin-right: 4px;

  ::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: transparent;
    border-radius: 50%;
  }

  ${InputElement}:checked + & {
    border-color: #fec301;
    ::after {
      background-color: #fec301;
    }
  }
`;