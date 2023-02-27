import dayjs from "dayjs";
import { BaseBlock, BlockArgs } from "../core/block-args";
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EOperatorOrder } from "../types";

export const TextCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '텍스트', en: 'Text' },
  colour: EBlockHueColour.TEXT,
  categoryIcon: ['/images/icon/blockly-text-on.svg', '/images/icon/blockly-text-off.svg'],
  contents: [
    {
      type: 'block-output',
      name: 'text',
      message0: {
        ko: '%1',
      },
      args0: [
        BlockArgs.Field.text({ name: 'TEXT', defaultText: '' }),
      ],
      output: EBlockStrictType.STRING,
      extensions: ['text_quotes'],
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'text-multiline',
      message0: {
        ko: '%1',
      },
      args0: [
        BlockArgs.Field.textMultiline({ name: 'TEXT', defaultText: '' }),
      ],
      output: EBlockStrictType.STRING,
      extensions: ['text_quotes'],
      toJavascript() {
        let text: string = BlockArgs.getFieldArgsValue(this, 'TEXT');
        text = text.replace(/"/g, '\"');
        text = text.replace(/\n/g, '\\n');
        return [`"${text}"`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_join',
      extraState: { itemCount: 2 },
      inputsInline: true,
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_append',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_length',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_isEmpty',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_indexOf',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_charAt',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_getSubstring',
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'text_changeCase_ex',
      output: EBlockStrictType.STRING,
      message0: {
        ko: '%2를 %1변경하기',
        en: 'Changing %2 to %1',
      },
      tooltip: {
        ko: '영문 대소문자 형태를 변경해 돌려줍니다.',
        en: 'Changes the uppercase and lowercase letters and returns them.',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'CASE',
          options: [
            { key: 'UPPERCASE', text: { ko: '대문자로', en: 'uppercase' } },
            { key: 'LOWERCASE', text: { ko: '소문자로', en: 'lowercase' } },
            { key: 'TITLECASE', text: { ko: '첫 문자만 대문자로', en: 'capitalize' } },
          ],
        }),
        BlockArgs.Input.value({ name: 'TEXT', strictType: EBlockStrictType.STRING }),
      ],
      presetFields: {
        CASE: 'UPPERCASE',
      },
      excutes: [
        {
          name: 'toCapitalize',
          excute() {
            return (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
          },
        },
      ],
      toJavascript() {
        const type = this.getFieldValue('CASE');
        const text: string = BlockArgs.getInputArgsValue(this, 'TEXT');
        let code = text;
        if (type === 'UPPERCASE') {
          code = `${text}.toUpperCase()`;
        }
        if (type === 'LOWERCASE') {
          code = `${text}.toLowerCase()`;
        }
        if (type === 'TITLECASE') {
          code = `toCapitalize(${text})`;
        }
        return [code, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'text_trim',
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'changeTypeToNumber',
      output: EBlockStrictType.NUMBER,
      colour: EBlockHueColour.MATH,
      message0: {
        en: 'Change %1 to number type',
        ko: '%1을 숫자형태로 변경',
      },
      tooltip: {
        en: 'Change character type to number type.',
        ko: '문자 형태의 데이터를 숫자 형태로 변경합니다.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'var', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        var: { block: BaseBlock.string('10') },
      },
      inputsInline: true,
      excutes: [
        {
          name: 'changeTypeToNumber',
          excute() {
            return (s: string | number) => {
              let value = 0;
              if (isNaN(Number(s)) === false) {
                value = Number(s);
              }
              return value;
            };
          },
        },
      ],
      toJavascript() {
        const number = BlockArgs.getInputArgsValue(this, 'var');
        const code = `changeTypeToNumber(${number})`;
        return [code, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'get_prompt_value',
      output: EBlockStrictType.ANY,
      message0: {
        en: 'Prompt for %1 with message %2',
        ko: '메시지를 활용해 %1 입력 %2',
      },
      tooltip: {
        en: 'Prompt for user for some text.',
        ko: '문장에 대해 사용자의 입력을 받습니다.',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'type',
          options: [
            { key: 'text', text: { ko: '문장', en: 'text' } },
            { key: 'number', text: { ko: '숫자', en: 'number' } },
          ],
        }),
        BlockArgs.Input.value({ name: 'text', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        text: { block: BaseBlock.string('input') },
      },
      presetFields: {
        type: 'text',
      },
      excutes: [
        {
          name: 'getPromptValue',
          excute() {
            return (text: string, type: string) => {
              const v = window.prompt(text) || '';
              if (type === 'number') return Number(v);
              return v;
            };
          },
        },
      ],
      toJavascript() {
        const text = BlockArgs.getInputArgsValue(this, 'text');
        const type = this.getFieldValue('type');
        const code = `getPromptValue(${text}, '${type}')`;
        return [code, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

  ],
};
