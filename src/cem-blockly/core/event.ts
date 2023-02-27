import EventEmitter from 'events';
import { EventBlockType } from '../types';

export interface ICemBlocklyEvents {
  'run': (eventBlockType: EventBlockType) => void;
  'stop': (eventBlockType: EventBlockType) => void;
  'stepRun': () => void;
  'stepRunAuto': () => void;
  'stepStop': () => void;
  'changeVisiblity': (visible: boolean) => void;
  'changeExecutable': (executable: boolean) => void;
}

export declare interface EventManager {
  on<U extends keyof ICemBlocklyEvents>(
    event: U, listener: ICemBlocklyEvents[U]
  ): this;

  off<U extends keyof ICemBlocklyEvents>(
    event: U, listener: ICemBlocklyEvents[U]
  ): this;

  emit<U extends keyof ICemBlocklyEvents>(
    event: U, ...args: Parameters<ICemBlocklyEvents[U]>
  ): boolean;
}

export class EventManager extends EventEmitter { }
