import dayjs from 'dayjs';
import { BaseBlock, BlockArgs } from '../core/block-args';
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EOperatorOrder, ExcuteCemStellariumFunc } from '../types';

export const TimeCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '시간', en: 'Time' },
  colour: EBlockHueColour.TIME,
  categoryIcon: ['/images/icon/time.png', '/images/icon/time.png'],
  contents: [
    {
      type: 'block-output',
      name: 'date_number',
      output: EBlockStrictType.DATETIME,
      message0: {
        ko: '날짜/시간: %1',
        en: 'Date/Time: %1',
      },
      args0: [
        BlockArgs.Field.text({ name: 'data' }),
      ],
      presetFields: {
        data: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      tooltip: {
        ko: '날짜 및 시간을 표현하는 블록입니다.',
        en: 'A block that represents a date and time.',
      },
      colour: EBlockHueColour.MATH,
      toJavascript() {
        const data = BlockArgs.getFieldArgsValue(this, 'data');
        return [`'${data}'`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_date_time',
      message0: {
        ko: '관측 날짜를 %1로 설정하기',
        en: 'Set the observation date to %1.',
      },
      tooltip: {
        ko: '관측 날짜를 설정합니다.',
        en: 'Sets the observation date.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'datetime', strictType: EBlockStrictType.DATETIME }),
      ],
      nextStatement: null,
      previousStatement: null,
      presetInputs: {
        datetime: { block: BaseBlock.date(new Date().getTime()) },
      },
      inputsInline: true,
      excutes: [
        {
          name: 'setCurrentDatetime',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (datetime: number) => excutor((cemStellarium) => {
              cemStellarium.currentDateTime = datetime;
            });
          },
        },
      ],
      toJavascript() {
        const datetime = BlockArgs.getInputArgsValue(this, 'datetime');
        const data = dayjs(datetime.replace(/'/g, '')).valueOf();
        return `setCurrentDatetime(${data});\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_latitude_and_longitude',
      message0: {
        ko: '관측 지역의 위도를 %1 경도를 %2로 설정하기',
        en: 'Set the observation area latitude to %1 longitude to %2.',
      },
      tooltip: {
        ko: '관측 지역의 위도값과 경도값을 설정합니다.',
        en: 'Sets the latitude and longitude values for the observation area.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'latitude', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'longitude', strictType: EBlockStrictType.NUMBER }),
      ],
      nextStatement: null,
      previousStatement: null,
      presetInputs: {
        latitude: { block: BaseBlock.number(37.567) },
        longitude: { block: BaseBlock.number(126.974) },
      },
      inputsInline: true,
      excutes: [
        {
          name: 'setLatitudeAndLongitude',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              latitude: number, longitude: number,
            ) => excutor((cemStellarium) => {
              cemStellarium.setGeoLocation({ latitude, longitude })
            });
          },
        },
      ],
      toJavascript() {
        const latitude = BlockArgs.getInputArgsValue(this, 'latitude');
        const longitude = BlockArgs.getInputArgsValue(this, 'longitude');
        return `setLatitudeAndLongitude(${latitude}, ${longitude});\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_time_speed',
      message0: {
        ko: '관측 시간 배속을 %1 %2로 설정하기',
        en: 'To set the time rate %1 %2 times',
      },
      tooltip: {
        ko: '관측 시간이 흘러가는 속도를 설정합니다.',
        en: 'Sets the speed at which time passes.',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'direction',
          options: [
            { key: 'forward', text: { ko: '정방향', en: 'forward' } },
            { key: 'backward', text: { ko: '역방향', en: 'backward' } },
          ]
        }),
        BlockArgs.Field.dropdownText({
          name: 'timeSpeed',
          options: [
            { key: '0', text: '0' },
            { key: '1', text: 'x1' },
            { key: '16', text: 'x2⁴' },
            { key: '256', text: 'x2⁸' },
            { key: '4096', text: 'x2¹²' },
            { key: '65536', text: 'x2¹⁶' },
          ]
        }),
      ],
      nextStatement: null,
      previousStatement: null,
      presetFields: {
        direction: 'forward',
        timeSpeed: '16',
      },
      inputsInline: true,
      excutes: [
        {
          name: 'setTimeSpeed',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              timeSpeed: number,
            ) => excutor((cemStellarium) => {
              cemStellarium.setTimeSpeed(timeSpeed);
            });
          },
        },
      ],
      toJavascript() {
        const direction = BlockArgs.getFieldArgsValue(this, 'direction');
        const timeSpeed = BlockArgs.getFieldArgsValue(this, 'timeSpeed');
        let timeSpeedNumber = Number(timeSpeed);
        if (direction === 'backward') {
          timeSpeedNumber = -timeSpeedNumber;
        }
        return `setTimeSpeed(${timeSpeedNumber});\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'add_datetime',
      message0: {
        ko: '현재 관측 시간에 %1 %2 더하기',
        en: 'Add %1 %2 to the current time',
      },
      tooltip: {
        ko: '주어진 시간만큼 현재 시간을 더합니다.',
        en: 'Adds the current time as much as the given time.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'value', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Field.dropdownText({
          name: 'unit',
          options: [
            { key: 'y', text: { ko: '년', en: 'years' } },
            { key: 'M', text: { ko: '개월', en: 'months' } },
            { key: 'd', text: { ko: '일', en: 'days' } },
            { key: 'h', text: { ko: '시간', en: 'hours' } },
            { key: 'm', text: { ko: '분', en: 'minutes' } },
            { key: 's', text: { ko: '초', en: 'seconds' } },
          ]
        }),
      ],
      nextStatement: null,
      previousStatement: null,
      presetInputs: {
        value: { block: BaseBlock.number(6) },
      },
      presetFields: {
        unit: 'h',
      },
      inputsInline: true,
      excutes: [
        {
          name: 'addDateTime',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              value: number, unit: dayjs.ManipulateType,
            ) => excutor((cemStellarium) => {
              const current = cemStellarium.currentDateTime;
              const next = dayjs(current).add(value, unit).valueOf();
              cemStellarium.currentDateTime = next;
            });
          },
        },
      ],
      toJavascript() {
        const value = BlockArgs.getInputArgsValue(this, 'value');
        const unit = BlockArgs.getFieldArgsValue(this, 'unit');
        return `addDateTime(${value}, '${unit}');\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'get_current_datetime',
      output: EBlockStrictType.DATETIME,
      message0: {
        ko: '현재 관측시간 가져오기',
        en: 'Get current datetime',
      },
      tooltip: {
        ko: '현재 관측시간 정보를 가져옵니다.',
        en: 'Gets the current observation time information.',
      },
      excutes: [
        {
          name: 'getCurrentDatetime',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return () => excutor((cemStellarium) => {
              return cemStellarium.currentDateTime;
            });
          },
        },
      ],
      toJavascript() {
        return [`getCurrentDatetime()`, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'date_format',
      output: EBlockStrictType.STRING,
      message0: {
        ko: '시간 %1을 %2로 포맷하기',
        en: 'Format time %1 to %2',
      },
      tooltip: {
        ko: 'YY(년), MM(월), DD(일), HH(시), mm(분), ss(초)',
        en: 'YY(years), MM(months), DD(days), HH(hours), mm(minutes), ss(seconds)',
      },
      args0: [
        BlockArgs.Input.value({ name: 'datetime', strictType: EBlockStrictType.DATETIME }),
        BlockArgs.Input.value({ name: 'format', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        datetime: { block: BaseBlock.date(dayjs().valueOf()) },
        format: { block: BaseBlock.string('YYYY-MM-DD HH:mm:ss') },
      },
      excutes: [
        {
          name: 'dateFormat',
          excute() {
            return (datetime: number, format: string) => {
              return dayjs(datetime).format(format);
            };
          },
        },
      ],
      toJavascript() {
        const datetime = BlockArgs.getInputArgsValue(this, 'datetime');
        const format = BlockArgs.getInputArgsValue(this, 'format');
        return [`dateFormat(${datetime}, ${format})`, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

  ],
}