import * as Blockly from 'blockly';
import Interpreter from '../interpreter/lib/interpreter';
import { Language, Message } from '../types';

export function translateMessage(message: Message, language: Language) {
  if (typeof message === 'string') return message;
  return message[language] || message.ko;
}

export function collectNextBlock(block: Blockly.BlockSvg, result: Blockly.BlockSvg[] = []) {
  result.push(block);
  const nextBlock = block.getNextBlock();
  if (nextBlock) {
    collectNextBlock(nextBlock, result);
  }
  return result;
}

export function timeSleep(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}

interface PickDateProps {
  x?: number;
  y?: number;
  defaultValue?: number;
  callback?: (event: Event) => void;
}
export function pickDate({
  x = 0,
  y = 0,
  callback = () => { },
  defaultValue = new Date().getTime(),
}: PickDateProps) {
  const input = document.createElement('input');
  input.type = 'datetime-local';
  input.step = '1';
  input.style.position = 'fixed';
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  input.style.visibility = `hidden`;
  document.body.appendChild(input);
  input.onchange = (e: Event) => {
    callback && callback(e);
    input.remove();
  };
  (input as any).showPicker();
}

export function pseudoToNativeCoordinates(coord: [number, number]): [number, number] {
  if ((coord as any)?.isObject) {
    return Interpreter.prototype.arrayPseudoToNative(coord);
  } else {
    return coord;
  }
}