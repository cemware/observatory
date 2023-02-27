import * as Blockly from 'blockly';
import { EBlockHueColour } from '../types';

const style = (colourPrimary: string): Blockly.Theme.BlockStyle => ({ colourPrimary } as any);

const blockStyles: { [key: string]: Blockly.Theme.BlockStyle } = {
  procedure_blocks: style(EBlockHueColour.FUNCTION),
  variable_blocks: style(EBlockHueColour.VARIABLE),
  variable_dynamic_blocks: style(EBlockHueColour.VARIABLE),
  loop_blocks: style(EBlockHueColour.CONTROL),
  logic_blocks: style(EBlockHueColour.LOGIC),
  list_blocks: style(EBlockHueColour.LIST),
  text_blocks: style(EBlockHueColour.TEXT),
  math_blocks: style(EBlockHueColour.MATH),
};

export const customTheme = Blockly.Theme.defineTheme('custom', {
  name: 'custom',
  base: Blockly.Themes.Classic,
  blockStyles,
});
