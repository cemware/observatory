import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import dayjs from 'dayjs';
import { EBlockStrictType, EOperatorOrder, Message } from '../types';

const argsInputValue = ({ name, strictType }: {
  name: string,
  strictType: EBlockStrictType | EBlockStrictType[],
}) => ({
  type: 'input_value' as const,
  name,
  check: strictType,
});

const argsInputStatement = ({ name }: {
  name: string,
}) => ({
  type: 'input_statement' as const,
  name,
});

const argsInputDummy = () => ({
  type: 'input_dummy' as const,
});

const argsFieldString = ({ name, defaultText }: {
  name: string,
  defaultText?: string;
}) => ({
  type: 'field_input' as const,
  name,
  text: defaultText,
  spellcheck: false,
});

const argsFieldTextMultiline = ({ name, defaultText }: {
  name: string,
  defaultText?: string;
}) => ({
  type: 'field_multilinetext' as const,
  name,
  text: defaultText,
  spellcheck: false,
});

const argsFieldNumber = ({ name, defaultValue, min, max, precision }: {
  name: string,
  defaultValue?: number,
  min?: number,
  max?: number,
  precision?: number,
}) => ({
  type: 'field_number' as const,
  name,
  value: defaultValue,
  min,
  max,
  precision,
});

const argsFieldColor = ({ name, defaultColor }: {
  name: string,
  defaultColor?: string;
}) => ({
  type: 'field_colour' as const,
  name,
  colour: defaultColor,
});

const argsFieldDropdownText = ({ name, options }: {
  name: string,
  options: {
    text: Message;
    key: string;
  }[];
}) => ({
  type: 'field_dropdown' as const,
  name,
  options: options.map(({ text, key }) => [text, key]),
});

const argsFieldDropdownImage = ({ name, imageWidth, imageHeight, options }: {
  name: string,
  imageWidth: number;
  imageHeight: number;
  options: {
    src: string;
    altText: string;
    key: string;
  }[];
}) => ({
  type: 'field_dropdown' as const,
  name,
  options: options.map(({ altText, src, key }) => [{
    src,
    width: imageWidth,
    height: imageHeight,
    alt: altText,
  }, key]),
});

const argsFieldCheckbox = ({ name, defaultChecked }: {
  name: string,
  defaultChecked?: boolean;
}) => ({
  type: 'field_checkbox' as const,
  name,
  checked: defaultChecked,
});

const argsFieldAngle = ({ name, defaultAngle }: {
  name: string,
  defaultAngle?: number;
}) => ({
  type: 'field_angle' as const,
  name,
  checked: defaultAngle,
});

const argsFieldVariable = ({ name, variableName, variableTypes, defaultType }: {
  name: string,
  variableName: string;
  variableTypes?: EBlockStrictType[];
  defaultType?: EBlockStrictType;
}) => ({
  type: 'field_variable' as const,
  name,
  variable: variableName,
  variableTypes,
  defaultType,
});

const argsFieldLabel = ({ text }: {
  text: string,
}) => ({
  type: 'field_label' as const,
  text,
});

const argsFieldImage = ({ name, src, width, height, alt }: {
  name: string,
  src: string,
  width: number,
  height: number,
  alt: string,
}) => ({
  type: 'field_image' as const,
  name,
  src,
  width,
  height,
  alt,
});

const blockNumber = (number: number) => ({
  type: 'math_number',
  fields: {
    NUM: number,
  },
});

const blockString = (string: string) => ({
  type: 'text',
  fields: {
    TEXT: string,
  },
});

const blockColor = (color: string) => ({
  type: 'colour_picker',
  fields: {
    COLOUR: color,
  },
});

const blockDate = (datetime: number) => ({
  type: 'date_number',
  fields: {
    data: dayjs(datetime).format('YYYY-MM-DD HH:mm:ss'),
  },
});

const blockListString = (data: Array<string>) => ({
  type: 'lists_create_with',
  inline: true,
  inputs: Object.fromEntries(data.map((str, i) => {
    const key = `ADD${i}`;
    const block = { block: blockString(str) };
    return [key, block];
  })),
  extraState: { itemCount: data.length },
});

const blockListNumber = (data: Array<number>) => ({
  type: 'lists_create_with',
  inline: true,
  inputs: Object.fromEntries(data.map((n, i) => {
    const key = `ADD${i}`;
    const block = { block: blockNumber(n) };
    return [key, block];
  })),
  extraState: { itemCount: data.length },
});

const blockListColor = (data: Array<string>) => ({
  type: 'lists_create_with',
  inline: true,
  inputs: Object.fromEntries(data.map((str, i) => {
    const key = `ADD${i}`;
    const block = { block: blockColor(str) };
    return [key, block];
  })),
  extraState: { itemCount: data.length },
});

const blockAngleHour = ({
  hour = 0, min = 0, sec = 0
}: { hour?: number, min?: number, sec?: number }) => ({
  type: 'angle_hour',
  fields: { hour, min, sec },
});

const blockAngleDegree = ({
  deg = 0, min = 0, sec = 0
}: { deg?: number, min?: number, sec?: number }) => ({
  type: 'angle_degree',
  fields: { deg, min, sec },
});

const blockAngleRadian = (radian: number) => ({
  type: 'angle_radian',
  fields: { radian },
});

type AngleCoord = Parameters<typeof blockAngleHour>[0] | Parameters<typeof blockAngleDegree>[0] | number;

const blockAngleCoordinates = (
  coord1: AngleCoord,
  coord2: AngleCoord,
) => {
  let block1: any = {};
  if (typeof coord1 === 'number') {
    block1 = blockAngleRadian(coord1);
  } else if ((coord1 as any).hour !== undefined) {
    block1 = blockAngleHour(coord1);
  } else if ((coord1 as any).deg !== undefined) {
    block1 = blockAngleDegree(coord1);
  }
  let block2: any = {};
  if (typeof coord2 === 'number') {
    block2 = blockAngleRadian(coord2);
  } else if ((coord2 as any).hour !== undefined) {
    block2 = blockAngleHour(coord2);
  } else if ((coord2 as any).deg !== undefined) {
    block2 = blockAngleDegree(coord2);
  }
  return {
    type: 'angle_coordinates',
    inputs: {
      coord1: { block: block1 },
      coord2: { block: block2 },
    },
  };
};

const blockListCoordinates = (data: Array<[AngleCoord, AngleCoord]>) => ({
  type: 'lists_create_with',
  inline: false,
  inputs: Object.fromEntries(data.map((n, i) => {
    const key = `ADD${i}`;
    const block = { block: blockAngleCoordinates(n[0], n[1]) };
    return [key, block];
  })),
  extraState: { itemCount: data.length },
});

export const BlockArgs = {
  Input: {
    value: argsInputValue,
    statement: argsInputStatement,
    dummy: argsInputDummy,
  },
  Field: {
    text: argsFieldString,
    textMultiline: argsFieldTextMultiline,
    number: argsFieldNumber,
    color: argsFieldColor,
    dropdownText: argsFieldDropdownText,
    dropdownImage: argsFieldDropdownImage,
    checkbox: argsFieldCheckbox,
    angle: argsFieldAngle,
    variable: argsFieldVariable,
    label: argsFieldLabel,
    image: argsFieldImage,
  },
  getInputArgsValue(block: Blockly.Block, name: string, order = EOperatorOrder.NONE) {
    return javascriptGenerator.valueToCode(block, name, order) || 'undefined';
  },
  getInputArgsValueAsString(block: Blockly.Block, name: string, order = EOperatorOrder.NONE) {
    return `String(${javascriptGenerator.valueToCode(block, name, order) || 'undefined'})`;
  },
  getInputArgsValueAsNumber(block: Blockly.Block, name: string, order = EOperatorOrder.NONE) {
    return `Number(${javascriptGenerator.valueToCode(block, name, order) || 'undefined'})`;
  },
  getFieldArgsValue(block: Blockly.Block, name: string) {
    return block.getFieldValue(name) || '';
  },
};

export const BaseBlock = {
  number: blockNumber,
  string: blockString,
  color: blockColor,
  date: blockDate,
  listString: blockListString,
  listNumber: blockListNumber,
  listColor: blockListColor,
  listCoordinates: blockListCoordinates,
  angleHour: blockAngleHour,
  angleDegree: blockAngleDegree,
  angleRadian: blockAngleRadian,
  angleCoordinates: blockAngleCoordinates,
};

type InputGroup = typeof BlockArgs['Input'];
type FieldGroup = typeof BlockArgs['Field'];

export type BlockArgsType = ReturnType<InputGroup[keyof InputGroup] | FieldGroup[keyof FieldGroup]>;
