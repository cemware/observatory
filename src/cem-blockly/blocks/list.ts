import { BlockCategory, BlockDefinition, EBlockHueColour } from "../types";

export const ListCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '리스트', en: 'List' },
  colour: EBlockHueColour.LIST,
  categoryIcon: ['/images/icon/blockly-list-on.svg', '/images/icon/blockly-list-off.svg'],
  contents: [
    {
      type: 'block-built-in',
      name: 'lists_create_with',
      inputsInline: true,
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_repeat',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_length',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_isEmpty',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_indexOf',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_getIndex',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_setIndex',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_getSublist',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_split',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_sort',
    } as BlockDefinition,

    {
      type: 'block-built-in',
      name: 'lists_reverse',
    } as BlockDefinition,
  ],
};
