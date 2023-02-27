import { BaseBlock, BlockArgs } from '../core/block-args';
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EventBlockType, ExcuteCemStellariumFunc } from '../types';

export const EventCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '이벤트', en: 'Event' },
  colour: EBlockHueColour.EVENT,
  categoryIcon: ['/images/icon/blockly-event-on.svg', '/images/icon/blockly-event-off.svg'],
  contents: [

    {
      type: 'block-statement',
      name: EventBlockType.START,
      message0: {
        ko: '시작하기',
        en: 'Getting start',
      },
      tooltip: {
        ko: '여기에 블럭을 붙여 시작 합니다.',
        en: 'Start pasting the blocks here.',
      },
      startHats: true,
      nextStatement: null,
      excutes: [
        {
          name: 'start',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return () => {

            };
          },
        },
      ],
      toJavascript() {
        return `start();\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: EventBlockType.EVENT_KEYBOARD,
      message0: {
        ko: '%1 키가 눌렸을 때',
        en: 'When the %1 key is pressed',
      },
      tooltip: {
        ko: '해당하는 키보드가 눌렸을 때 실행합니다.',
        en: 'Executes when the corresponding keyboard is pressed.',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'keyCode',
          options: [
            { key: ' ', text: 'Space' },
            { key: 'enter', text: 'Enter' },
            { key: 'arrowup', text: '↑' },
            { key: 'arrowdown', text: '↓' },
            { key: 'arrowleft', text: '←' },
            { key: 'arrowright', text: '→' },
            { key: 'alt', text: 'Alt' },
            { key: 'shift', text: 'Shift' },
            { key: 'pageup', text: 'PageUp' },
            { key: 'pagedown', text: 'PageDown' },
            { key: 'a', text: 'A' },
            { key: 'b', text: 'B' },
            { key: 'c', text: 'C' },
            { key: 'd', text: 'D' },
            { key: 'e', text: 'E' },
            { key: 'f', text: 'F' },
            { key: 'g', text: 'G' },
            { key: 'h', text: 'H' },
            { key: 'i', text: 'I' },
            { key: 'j', text: 'J' },
            { key: 'k', text: 'K' },
            { key: 'l', text: 'L' },
            { key: 'm', text: 'M' },
            { key: 'n', text: 'N' },
            { key: 'o', text: 'O' },
            { key: 'p', text: 'P' },
            { key: 'q', text: 'Q' },
            { key: 'r', text: 'R' },
            { key: 's', text: 'S' },
            { key: 't', text: 'T' },
            { key: 'u', text: 'U' },
            { key: 'v', text: 'V' },
            { key: 'w', text: 'W' },
            { key: 'x', text: 'X' },
            { key: 'y', text: 'Y' },
            { key: 'z', text: 'Z' },
            { key: '0', text: '0' },
            { key: '1', text: '1' },
            { key: '2', text: '2' },
            { key: '3', text: '3' },
            { key: '4', text: '4' },
            { key: '5', text: '5' },
            { key: '6', text: '6' },
            { key: '7', text: '7' },
            { key: '8', text: '8' },
            { key: '9', text: '9' },
          ],
        }),
      ],
      startHats: true,
      nextStatement: null,
      excutes: [
        {
          name: 'eventKeyPressed',
          excute: () => () => { },
        },
      ],
      toJavascript() {
        const keyCode = this.getFieldValue('keyCode') || '';
        return `eventKeyPressed('${keyCode}');\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: EventBlockType.EVENT_BLOCK_CLICK,
      message0: {
        ko: '%1 이 블록을 클릭했을 때',
        en: '%1 When the flag is clicked',
      },
      tooltip: {
        ko: '이 블록을 클릭했을 때 실행합니다.',
        en: 'Execute when the flag block is clicked.',
      },
      args0: [
        BlockArgs.Field.image({
          name: 'image',
          src: '/images/icon/blockly-event-on.svg',
          width: 35,
          height: 35,
          alt: '🚩',
        }),
      ],
      startHats: true,
      nextStatement: null,
      excutes: [
        {
          name: 'eventClickFlag',
          excute: () => () => { },
        },
      ],
      toJavascript() {
        return 'eventClickFlag();\n';
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: EventBlockType.EVENT_GENERATE_RUN,
      message0: {
        ko: '이벤트 %1가 발생했을 때',
        en: 'When event %1 triggered',
      },
      tooltip: {
        ko: '해당 이름의 이벤트가 발생했을 때 실행합니다.',
        en: 'Executes when an event with that name occurs.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'eventName', strictType: [EBlockStrictType.STRING, EBlockStrictType.ARRAY] }),
      ],
      presetInputs: {
        eventName: { block: BaseBlock.string('A') },
      },
      startHats: true,
      nextStatement: null,
      excutes: [
        {
          name: 'eventCustom',
          excute: () => () => { },
        },
      ],
      toJavascript() {
        const eventName = BlockArgs.getInputArgsValue(this, 'eventName');
        this.data = eventName;
        return `eventCustom(${eventName});\n`;
      },
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: EventBlockType.EVENT_GENERATE,
      message0: {
        ko: '이벤트 %1 발생시키기',
        en: 'Trigger event %1',
      },
      tooltip: {
        ko: '해당 이름의 이벤트를 발생시킵니다.',
        en: 'Trigger an event with that name.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'eventName', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        eventName: { block: BaseBlock.string('A') },
      },
      startHats: true,
      previousStatement: null,
      nextStatement: null,
      excutes: [],
      toJavascript() {
        const eventName = BlockArgs.getInputArgsValue(this, 'eventName');
        this.data = eventName;
        return `generateEvent(${eventName});\n`;
      },
    } as BlockDefinition,

  ],
}