import { BlockArgs } from "../core/block-args";
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EOperatorOrder } from "../types";

export const LogicCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '논리', en: 'Logic' },
  colour: EBlockHueColour.LOGIC,
  categoryIcon: ['/images/icon/blockly-logic-on.svg', '/images/icon/blockly-logic-off.svg'],
  contents: [
    {
      type: 'block-built-in',
      name: 'controls_if',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'controls_if',
      extraState: {
        hasElse: true,
      },
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'logic_operation',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'logic_boolean',
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'logic_compare',
      output: EBlockStrictType.BOOLEAN,
      message0: {
        ko: '%1 %2 %3',
        en: '%1 %2 %3',
      },
      args0: [
        BlockArgs.Input.value({ name: 'A', strictType: [EBlockStrictType.NUMBER, EBlockStrictType.STRING] }),
        BlockArgs.Field.dropdownText({
          name: 'OP',
          options: [
            { key: 'EQ', text: '=' },
            { key: 'NEQ', text: '\u2260' },
            { key: 'LT', text: '\u200F<' },
            { key: 'LTE', text: '\u200F\u2264' },
            { key: 'GT', text: '\u200F>' },
            { key: 'GTE', text: '\u200F\u2265' },
          ],
        }),
        BlockArgs.Input.value({ name: 'B', strictType: [EBlockStrictType.NUMBER, EBlockStrictType.STRING] }),
      ],
      inputsInline: true,
      extensions: ['logic_op_tooltip'],
      excutes: [
        {
          name: 'compare',
          excute() {
            return () => {

            };
          },
        },
      ],
      toJavascript() {
        const operator = this.getFieldValue('OP') || 'EQ';
        const a = BlockArgs.getInputArgsValue(this, 'A');
        const b = BlockArgs.getInputArgsValue(this, 'B');
        let result = '';
        if (operator === 'EQ') result = `${a} == ${b}`;
        if (operator === 'NEQ') result = `${a} == ${b}`;
        if (operator === 'LT') result = `${a} < ${b}`;
        if (operator === 'LTE') result = `${a} <= ${b}`;
        if (operator === 'GT') result = `${a} > ${b}`;
        if (operator === 'GTE') result = `${a} >= ${b}`;
        return [result, EOperatorOrder.FUNCTION_CALL];
      },
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'logic_negate',
    } as BlockDefinition,
  ],
};
