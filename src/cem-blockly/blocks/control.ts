import { BaseBlock, BlockArgs } from "../core/block-args";
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType } from "../types";

export const ControlCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '제어', en: 'Control' },
  colour: EBlockHueColour.CONTROL,
  categoryIcon: ['/images/icon/blockly-control-on.svg', '/images/icon/blockly-control-off.svg'],
  contents: [
    {
      type: 'block-built-in',
      name: 'controls_repeat_ext',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'controls_whileUntil',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'controls_flow_statements',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'controls_for',
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'wait_seconds_basic_input',
      message0: {
        ko: '%1초 기다리기',
        en: 'Wait %1 second',
      },
      tooltip: {
        ko: '해당 초 만큼 기다렸다 다음 블록을 실행합니다.',
        en: 'Wait that number of seconds before executing the next block.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'SECONDS', strictType: EBlockStrictType.NUMBER }),
      ],
      presetInputs: {
        SECONDS: { block: BaseBlock.number(1) },
      },
      inputsInline: true,
      nextStatement: null,
      previousStatement: null,
      excutes: [
        {
          name: 'waitForSeconds',
          excuteAsync(workspace, runningInfo) {
            return (seconds: number, blockId: string, callback: Function) => {
              setTimeout(() => {
                const block = workspace.getBlockById(blockId);
                const topBlockId = block?.getRootBlock()?.id || '';
                const info = runningInfo[topBlockId];
                if (info && !info.paused) {
                  callback();
                } else if (!info) {
                  callback();
                }
              }, seconds * 1000);
            };
          },
        },
      ],
      toJavascript() {
        const blockId = this.id;
        const seconds = BlockArgs.getInputArgsValue(this, 'SECONDS');
        return `waitForSeconds(${seconds}, '${blockId}');\n`;
      },
    } as BlockDefinition,
  ],
};
