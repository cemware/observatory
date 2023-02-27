import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import cloneDeep from 'lodash.clonedeep';
import { BlockDefinition, EBlockStrictType, Language, Message } from '../types';
import { BlockArgsType } from './block-args';
import { translateMessage } from './utils';

interface DefineBlockOptions {
  language: Language;
  forceOverride: boolean;
}
export function defineBlock(definition: Readonly<BlockDefinition>, options: Partial<DefineBlockOptions> = {}) {
  const {
    language = 'ko',
    forceOverride = false,
  } = options;

  const blockDefinition = cloneDeep(definition) as BlockDefinition;
  if (blockDefinition.type === 'block-built-in') {
    return;
  }

  const { name, type, toJavascript } = blockDefinition;

  if (!forceOverride && Object.keys(Blockly.Blocks).includes(name)) {
    throw new Error(`Duplicated block name: ${name}`);
  }

  if (!javascriptGenerator[name]) {
    if (!toJavascript) throw new Error(`${name} 블록에 toJavascript 속성이 없습니다.`);
    javascriptGenerator[name] = toJavascript;
  }

  if (type === 'block-output' && blockDefinition.output === EBlockStrictType.ANY) {
    blockDefinition.output = null as any;
  }

  Object.keys(blockDefinition).forEach((key) => {
    if (key.indexOf('message') === 0 || key === 'tooltip') {
      (blockDefinition as any)[key] = translateMessage((blockDefinition as any)[key], language);
    }

    if (key.indexOf('args') === 0) {
      const args = (blockDefinition as any)[key] as BlockArgsType[];
      args.forEach((arg, i) => {
        if (arg.type === 'field_dropdown') {
          (blockDefinition as any)[key][i].options = arg.options
            .map(([t, k]: any) => {
              if (typeof t === 'string' || (typeof t === 'object' && t.ko)) {
                return [translateMessage(t as any, language), k] as Message[];
              }
              return [t, k];
            });
        }
      });
    }
  });

  Blockly.Blocks[name] = {
    init(this: Blockly.Block) {
      this.jsonInit(blockDefinition);
      if (blockDefinition.excutes?.length) {
        this.data = JSON.stringify(blockDefinition.excutes.map((e) => e.name));
      }

      if (this.type === 'date_number') {
        this.setEditable(false);
      }
    },
  };
}
