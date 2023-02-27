import * as Blockly from 'blockly';
import { CategoryRender } from './category-render';

const cssInjectionMap: Record<string, boolean> = {};

export function injectBlocklyCss(name: string, style: string) {
  if (cssInjectionMap[name]) return;
  cssInjectionMap[name] = true;
  Blockly.Css.register(style);
}

export const toolboxCss = `
  .blocklyMainBackground {
    stroke: none;
  }
  .injectionDiv {
    outline: none;
  }
  .blocklyToolboxDiv {
    background: #fff;
    border-right: 1px solid #e2e2e2;
  }
  .blocklyToolboxDiv::-webkit-scrollbar {
    display: none;
  }
  .blocklyToolboxCategory:hover .blocklyTreeIcon {
    border-width: 2px !important;
  }
`;
injectBlocklyCss('injectionDiv', toolboxCss);

Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  Blockly.ToolboxCategory.registrationName,
  CategoryRender, true,
);
