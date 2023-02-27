import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

interface InputDatetimeProps {
  datetime: number;
  onChange: (datetime: number) => void;
}
export const InputDatetime: React.FC<InputDatetimeProps> = ({
  datetime, onChange,
}) => {
  const year = useMemo(() => dayjs(datetime).format('YYYY'), [datetime]);
  const month = useMemo(() => dayjs(datetime).format('MM'), [datetime]);
  const day = useMemo(() => dayjs(datetime).format('DD'), [datetime]);
  const hour = useMemo(() => dayjs(datetime).format('HH'), [datetime]);
  const minute = useMemo(() => dayjs(datetime).format('mm'), [datetime]);
  const second = useMemo(() => dayjs(datetime).format('ss'), [datetime]);

  const onKeyDownInput = useCallback((unit: dayjs.ManipulateType) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      onChange(dayjs(datetime).add(-1, unit).valueOf());
    } else if (e.key === 'ArrowUp') {
      onChange(dayjs(datetime).add(+1, unit).valueOf());
    }
  }, [datetime]);

  const onWheelInput = useCallback((unit: dayjs.ManipulateType) => (e: React.WheelEvent<HTMLInputElement>) => {
    if (e.currentTarget.matches(':focus')) {
      const offset = e.deltaY > 0 ? -1 : 1;
      onChange(dayjs(datetime).add(offset, unit).valueOf());
    }
  }, [datetime]);

  const onChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  }, []);

  const pickerValue = useMemo(() => dayjs(datetime).format('YYYY-MM-DDTHH:mm:ss'), [datetime]);

  const onClickPicker = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const input = e.currentTarget.nextElementSibling as HTMLInputElement;
    (input as any).showPicker();
  }, []);

  const onChangePicker = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    onChange(dayjs(value).valueOf());
  }, [])

  return (
    <Wrapper>
      <Input type="text" data-unit="y" value={year} onKeyDown={onKeyDownInput('y')} onChange={onChangeInput} onWheel={onWheelInput('y')} />
      -
      <Input type="text" data-unit="M" value={month} onKeyDown={onKeyDownInput('M')} onChange={onChangeInput} onWheel={onWheelInput('M')} />
      -
      <Input type="text" data-unit="d" value={day} onKeyDown={onKeyDownInput('d')} onChange={onChangeInput} onWheel={onWheelInput('d')} />

      <Input type="text" data-unit="h" value={hour} onKeyDown={onKeyDownInput('h')} onChange={onChangeInput} onWheel={onWheelInput('h')} />
      :
      <Input type="text" data-unit="m" value={minute} onKeyDown={onKeyDownInput('m')} onChange={onChangeInput} onWheel={onWheelInput('m')} />
      :
      <Input type="text" data-unit="s" value={second} onKeyDown={onKeyDownInput('s')} onChange={onChangeInput} onWheel={onWheelInput('s')} />

      <DateTimePickerIcon onClick={onClickPicker} />
      <DateTimePickerInput type="datetime-local" step={1} value={pickerValue} onChange={onChangePicker} />

    </Wrapper>
  )
}

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 20px;
  padding: 0;
  border: none;
  text-align: right;
  outline: none;
  font-size: 16px;
  margin-right: 2px;

  &[data-unit="y"] {
    width: 40px;
  }

  &[data-unit="h"] {
    margin-left: 8px;
  }
`;

const DateTimePickerInput = styled.input`
  position: absolute;
  visibility: hidden;
`;

const DateTimePickerIcon = styled.button`
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: none;
  margin-left: auto;
  background-image: url('/images/icon/calendar.png');
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
`;