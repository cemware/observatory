import * as Blockly from 'blockly';
import { RegistryItem, Scope } from 'blockly/core/contextmenu_registry';
import { collectNextBlock } from './utils';

registerContextmenuDuplicateGroup();
function registerContextmenuDuplicateGroup() {
  const duplicateOption: RegistryItem = {
    displayText() {
      return `${Blockly.Msg.DUPLICATE_BLOCK_GROUP}`;
    },
    preconditionFn(scope: Scope) {
      const { block } = scope;
      if (!block!.isInFlyout && block!.isDeletable() && block!.isMovable() && !block!.outputConnection) {
        if (block!.isDuplicatable()) {
          return 'enabled';
        }
        return 'disabled';
      }
      return 'hidden';
    },
    callback(scope: Scope) {
      if (scope.block) {
        const blocks = collectNextBlock(scope.block);
        let prevBlock: Blockly.BlockSvg;
        blocks.forEach((block) => {
          const newBlock = Blockly.clipboard.duplicate(block) as Blockly.BlockSvg;
          if (prevBlock && newBlock) {
            const parentConnection = prevBlock.nextConnection;
            const childConnection = newBlock.previousConnection;
            parentConnection.connect(childConnection);
          }
          prevBlock = newBlock;
        });
      }
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'blockDuplicateGroup',
    weight: 0.5,
  };
  Blockly.ContextMenuRegistry.registry.register(duplicateOption);
}
