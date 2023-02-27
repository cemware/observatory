import * as Blockly from 'blockly';
import type { CemStellarium } from '@/cem-stellarium';
import { BlockArgsType } from '../core/block-args';
import { EBlockHueColour, EBlockStrictType, EOperatorOrder } from './enums';

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type BlockCategory = BlocklyCategoryContents | BlockCategoryCustom;

export type BlocklyCategoryContents = {
  type: 'contents';
  name: Message;
  colour: EBlockHueColour | string;
  contents: CategoryContents[];
  categoryIcon: string[];
}

export type BlockCategoryCustom = {
  type: 'custom';
  name: Message;
  colour: EBlockHueColour | string;
  custom: BlocklyOriginCategoryNames;
  categoryIcon: string[];
}

export type CategoryContents = BlockDefinition | ButtonDefinition | SeparatorDefinition | LabelDefinition;

type BlocklyOriginCategoryNames =
  typeof Blockly.VARIABLE_CATEGORY_NAME |
  typeof Blockly.VARIABLE_DYNAMIC_CATEGORY_NAME |
  typeof Blockly.PROCEDURE_CATEGORY_NAME;

export type Message = {
  ko: string;
  en?: string;
} | string;
export type Language = keyof Exclude<Message, string>;

export type BlockPresetInputs = {
  shadow?: any;
  block?: any;
}

export type ExcuteCemStellariumFunc<T> = (excutor: (app: CemStellarium) => T) => T;

export type ExcuteInterpreter = {
  name: string;
  excute?: (workspace: Blockly.WorkspaceSvg, runningInfo: RunningInfo) => Function;
  excuteAsync?: (workspace: Blockly.WorkspaceSvg, runningInfo: RunningInfo) => Function;
  excuteCemStellarium?: <T>(excutor: ExcuteCemStellariumFunc<T>) => Function;
  excuteAsyncCemStellarium?: <T>(excutor: ExcuteCemStellariumFunc<T>) => Function;
}

export type BlockDefinitionBuiltIn = {
  type: 'block-built-in';
  name: string;
  colour?: EBlockHueColour | string;
  style?: string;
  disabled?: boolean;
  extraState?: any;
  inputsInline?: boolean;
  _DEPRECATED?: boolean;
}

export type BlockDefinitionBase = {
  name: string;
  [message: `message${number}`]: Message | undefined;
  [args: `args${number}`]: BlockArgsType[] | undefined;
  message0?: Message;
  args0?: BlockArgsType[];
  colour?: EBlockHueColour | string;
  tooltip?: Message;
  helpUrl?: string;
  inputsInline?: boolean;
  extensions?: string[];
  mutator?: string;
  excutes?: ExcuteInterpreter[];
  disabled?: boolean;
  _DEPRECATED?: boolean;

  presetFields?: Record<string, string>;
  presetInputs?: Record<string, BlockPresetInputs>;
}

export interface BlockDefinitionOutput extends BlockDefinitionBase {
  type: 'block-output';
  output: EBlockStrictType;
  toJavascript(this: Blockly.Block): [string, EOperatorOrder];
}

export interface BlockDefinitionStatement extends BlockDefinitionBase {
  type: 'block-statement';
  startHats?: boolean;
  previousStatement?: string | null | undefined,
  nextStatement?: string | null | undefined,
  toJavascript(this: Blockly.Block): string;
}

export type BlockDefinition = BlockDefinitionOutput | BlockDefinitionStatement | BlockDefinitionBuiltIn;

export type ButtonDefinition = {
  type: 'button';
  name: string;
  text: Message;
  onClick: (button: Blockly.FlyoutButton) => void;
}

export type SeparatorDefinition = {
  type: 'seperator';
  gap: number;
}

export type LabelDefinition = {
  type: 'label';
  text: Message;
  name: string;
  style?: Partial<{
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    color: string;
  }>;
}

export type RunningInfo = {
  [topblockId: string]: {
    interpreterId: number;
    paused: boolean;
  }
};

export type BlocklyOptions = DeepPartial<{
  collapse: boolean;
  comments: boolean;
  css: boolean;
  disable: boolean;
  horizontalLayout: boolean;
  maxBlocks: number;
  maxInstances: object;
  media: string;
  oneBasedIndex: boolean;
  readOnly: boolean;
  renderer: string;
  rtl: boolean;
  scrollbars: object;
  sounds: boolean;
  theme: Blockly.Theme;
  toolbox: string | Object;
  toolboxPosition: string;
  trashcan: boolean;
  maxTrashcanContents: number;
  plugins: object;

  grid: {
    spacing: number;
    length: number;
    colour: string;
    snap: boolean;
  };

  move: {
    scrollbars: {
      horizontal: boolean,
      vertical: boolean
    },
    drag: boolean,
    wheel: boolean,
  };

  zoom: {
    controls: boolean,
    wheel: boolean,
    startScale: number,
    maxScale: number,
    minScale: number,
    scaleSpeed: number,
    pinch: boolean
  };
}>
