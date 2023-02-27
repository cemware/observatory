import { BlockCategory, EBlockHueColour } from "../types";

export const VariablesCategory: BlockCategory = {
  type: 'custom',
  name: { ko: '변수', en: 'Variables' },
  colour: EBlockHueColour.VARIABLE,
  custom: 'VARIABLE',
  categoryIcon: ['/images/icon/blockly-var-on.svg', '/images/icon/blockly-var-off.svg'],
};
