import { BlockCategory, EBlockHueColour } from "../types";

export const ProcedureCategory: BlockCategory = {
  type: 'custom',
  name: { ko: '함수', en: 'Function' },
  colour: EBlockHueColour.FUNCTION,
  custom: 'PROCEDURE',
  categoryIcon: ['/images/icon/blockly-func-on.svg', '/images/icon/blockly-func-off.svg'],
};
