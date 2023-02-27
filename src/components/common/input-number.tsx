import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(({
  ...props
}, ref) => {
  return (
    <InputElement
      ref={ref}
      type="number"
      {...props}
    />
  )
})

const InputElement = styled.input`
  flex: 1;
  padding: 6px 12px;
  border: 1px solid rgb(199, 205, 214);
  border-radius: 3px;
  outline: none;
  box-sizing: border-box;
  font-size: 14px;
  transition: .2s;
  min-width: 0;

  :focus {
    border-color: #fec301;
  }
`;