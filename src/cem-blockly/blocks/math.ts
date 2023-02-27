import { degreeToHour, degreeToRadian, hourToDegree, radianToDegree } from "@/helper/math";
import { BaseBlock, BlockArgs } from "../core/block-args";
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EOperatorOrder } from "../types";

export const MathCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '연산', en: 'Calculate' },
  colour: EBlockHueColour.MATH,
  categoryIcon: ['/images/icon/blockly-math-on.svg', '/images/icon/blockly-math-off.svg'],
  contents: [
    {
      type: 'block-built-in',
      name: 'math_number',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_random_float',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_arithmetic',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_single',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_trig',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_constant',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_round',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_on_list',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_modulo',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'math_number_property',
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'change_angle_unit',
      output: EBlockStrictType.NUMBER,
      message0: {
        ko: '%1 %2를 %3으로',
        en: '%1 %2 to %3',
      },
      tooltip: {
        ko: '각의 단위를 변경합니다.',
        en: 'Change unit of degree angle to radian.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'value', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Field.dropdownText({
          name: 'input',
          options: [
            { key: 'r', text: { ko: '라디안', en: 'radian' } },
            { key: 'd', text: { ko: '도(˚)', en: 'degree' } },
            { key: 'h', text: { ko: '시', en: 'hours' } },
          ],
        }),
        BlockArgs.Field.dropdownText({
          name: 'output',
          options: [
            { key: 'r', text: { ko: '라디안', en: 'radian' } },
            { key: 'd', text: { ko: '도(˚)', en: 'degree' } },
            { key: 'h', text: { ko: '시', en: 'hours' } },
          ],
        }),
      ],
      presetInputs: {
        value: { block: BaseBlock.number(90) },
      },
      presetFields: {
        input: 'd',
        output: 'r',
      },
      inputsInline: true,
      excutes: [],
      toJavascript() {
        let value = BlockArgs.getInputArgsValue(this, 'value');
        const input = BlockArgs.getFieldArgsValue(this, 'input');
        const output = BlockArgs.getFieldArgsValue(this, 'output');
        if (input === 'd') value = degreeToRadian(value);
        if (input === 'h') value = degreeToRadian(hourToDegree(value));
        if (output === 'd') value = radianToDegree(value);
        if (output === 'h') value = radianToDegree(degreeToHour(value));
        return [`${value}`, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'operator_assignment',
      output: EBlockStrictType.ANY,
      _DEPRECATED: true,
      message0: {
        en: '%1 %2 %3',
        ko: '%1 %2 %3',
      },
      tooltip: {
        en: 'Adds or subtracts the right value to the left value.',
        ko: '왼쪽 값에 오른쪽 값을 더하거나 빼는 연산을 합니다.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'variable', strictType: EBlockStrictType.ANY }),
        BlockArgs.Field.dropdownText({
          name: 'operator',
          options: [
            { key: 'assign', text: { ko: '=', en: '=' } },
            { key: 'addAndAssign', text: { ko: '+=', en: '+=' } },
            { key: 'minusAndAssign', text: { ko: '-=', en: '-=' } },
            { key: 'multiplyAndAssign', text: { ko: '*=', en: '*=' } },
            { key: 'divideAndAssign', text: { ko: '/=', en: '/=' } },
            { key: 'modulesAndAssign', text: { ko: '%=', en: '%=' } },
          ],
        }),
        BlockArgs.Input.value({ name: 'value', strictType: EBlockStrictType.ANY }),
      ],
      presetInputs: {
        variable: { block: BaseBlock.number(1) },
        value: { block: BaseBlock.number(1) },
      },
      presetFields: {
        operator: 'equal',
      },
      inputsInline: true,
      excutes: [],
      toJavascript() {
        const variable = BlockArgs.getInputArgsValue(this, 'variable');
        const value = BlockArgs.getInputArgsValue(this, 'value');
        const operator = this.getFieldValue('operator');
        let operatorData = '';
        switch (operator) {
          case 'assign':
            operatorData = '=';
            break;
          case 'addAndAssign':
            operatorData = '+=';
            break;
          case 'minusAndAssign':
            operatorData = '-=';
            break;
          case 'multiplyAndAssign':
            operatorData = '*=';
            break;
          case 'divideAndAssign':
            operatorData = '/=';
            break;
          case 'modulesAndAssign':
            operatorData = '%=';
            break;
          default:
            operatorData = '';
            break;
        }
        const code = `${variable} ${operatorData} ${value}`;
        return [code, EOperatorOrder.ADDITION];
      },
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'operator_comparison',
      output: EBlockStrictType.BOOLEAN,
      _DEPRECATED: true,
      message0: {
        en: '%1 %2 %3',
        ko: '%1 %2 %3',
      },
      tooltip: {
        en: 'Compares two values to differentiate between true and false.',
        ko: '두 값을 비교하여 참과 거짓을 구분합니다.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'variable', strictType: EBlockStrictType.ANY }),
        BlockArgs.Field.dropdownText({
          name: 'operator',
          options: [
            { key: 'equal', text: { ko: '==', en: '==' } },
            { key: 'perfectEqual', text: { ko: '===', en: '===' } },
            { key: 'notEqual', text: { ko: '!=', en: '!=' } },
            { key: 'greaterThan', text: { ko: '>', en: '>' } },
            { key: 'notLessThan', text: { ko: '>=', en: '>=' } },
            { key: 'lessThan', text: { ko: '<', en: '<' } },
            { key: 'notGreatherThan', text: { ko: '<=', en: '<=' } },
          ],
        }),
        BlockArgs.Input.value({ name: 'value', strictType: EBlockStrictType.ANY }),
      ],
      presetInputs: {
        variable: { block: BaseBlock.number(1) },
        value: { block: BaseBlock.number(1) },
      },
      presetFields: {
        operator: 'equal',
      },
      inputsInline: true,
      excutes: [],
      toJavascript() {
        const variable = BlockArgs.getInputArgsValue(this, 'variable');
        const value = BlockArgs.getInputArgsValue(this, 'value');
        const operator = this.getFieldValue('operator');
        let operatorData = '';
        switch (operator) {
          case 'equal':
            operatorData = '==';
            break;
          case 'perfectEqual':
            operatorData = '===';
            break;
          case 'notEqual':
            operatorData = '!=';
            break;
          case 'greaterThan':
            operatorData = '>';
            break;
          case 'notLessThan':
            operatorData = '>=';
            break;
          case 'notGreatherThan':
            operatorData = '<=';
            break;
          case 'lessThan':
            operatorData = '<';
            break;
          default:
            operatorData = '';
            break;
        }
        const code = `${variable} ${operatorData} ${value}`;
        return [code, EOperatorOrder.ADDITION];
      },
    } as BlockDefinition,
  ],
};
