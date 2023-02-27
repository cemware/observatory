import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { EventBlockType } from '../types';

Blockly.utils.object.values = Object.values;

export function generateCode(workspace: Blockly.WorkspaceSvg) {
  javascriptGenerator.init(workspace);
  javascriptGenerator.nameDB_.setVariableMap(workspace);
  const codes: { id: string; code: string }[] = [];
  const topBlocks = workspace.getTopBlocks(true);

  for (let i = 0; i < topBlocks.length; i += 1) {
    const block = topBlocks[i];
    const code = [];
    if (Object.values(EventBlockType).includes(block.type as any)) {
      let line: string = javascriptGenerator.blockToCode(block);
      if (Array.isArray(line)) [line] = line;
      if (!line) continue;
      if (block.outputConnection) {
        line = javascriptGenerator.scrubNakedValue(line);
        if (javascriptGenerator.STATEMENT_PREFIX && !block.suppressPrefixSuffix) {
          line = javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block) + line;
        }
        if (javascriptGenerator.STATEMENT_SUFFIX && !block.suppressPrefixSuffix) {
          line += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block);
        }
      }
      code.push(line);
    } else if (block.type.indexOf('procedures') === 0) {
      javascriptGenerator.blockToCode(block);
    }
    if (code.length) {
      codes.push({
        id: block.id,
        code: code.join('\n'),
      });
    }
  }

  const definitionCodeString = javascriptGenerator.finish('');

  return {
    definition: definitionCodeString,
    codes,
  };
}
