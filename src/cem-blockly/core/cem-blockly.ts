import * as Blockly from 'blockly';
import * as KO from 'blockly/msg/ko.js';
import * as EN from 'blockly/msg/en.js';
import { CrossTabCopyPaste } from '@blockly/plugin-cross-tab-copy-paste';
import '@blockly/block-plus-minus';
import { javascriptGenerator } from 'blockly/javascript';
import './context-menu';
import { updateLayoutBlockly } from './workspace-resize';
import {
  BlockCategory,
  BlocklyOptions,
  EventBlockType,
  ExcuteCemStellariumFunc,
  Language,
  Message,
  RunningInfo,
} from '../types';
import { defineBlock } from './block-define';
import { defineCategory } from './category-define';
import { generateCode } from './generate-code';
import { JsInterpreter } from '../interpreter';
import { EventManager } from './event';
import { collectNextBlock, pickDate, translateMessage } from './utils';
import { customTheme } from './theme';
import { CemStellarium } from '@/cem-stellarium';
import dayjs from 'dayjs';
import throttle from 'lodash.throttle';

const BASE_OPTIONS: BlocklyOptions = {
  renderer: 'geras',
  comments: true,
  collapse: true,
  disable: true,
  trashcan: true,
  maxTrashcanContents: 32,
  horizontalLayout: false,
  toolboxPosition: 'start',
  css: true,
  rtl: false,
  sounds: false,
  oneBasedIndex: false,
  grid: {
    spacing: 22,
    length: 24,
    colour: 'rgb(234, 234, 234)',
    snap: true,
  },
  zoom: {
    controls: false,
    wheel: true,
    startScale: 0.7,
    scaleSpeed: 1.03,
  },
};

interface CemBlocklyConstructor {
  rootElement: HTMLElement;
  blockConfigs: BlockCategory[];
  language: Language;
  cemStellarium?: CemStellarium;
  options?: BlocklyOptions;
}

const SANDBOX_MESSAGE: Message = {
  ko: '하나의 블록이 너무 많이 반복 실행되었습니다. 계속 실행할까요?',
  en: 'Many blocks have been executed. Do you want to continue?',
};

export class CemBlockly {
  public eventManager: EventManager;

  public sandboxMode = true;

  public maxSandboxCount = 4000;

  public eventThrottleMilliseconds = 100;

  #language: Language;

  #workspace: Blockly.WorkspaceSvg;

  #rootElement: HTMLElement;

  #blockConfigs: BlockCategory[];

  #cemStellarium?: CemStellarium;

  #interpreterFuncMap: Record<string, Function | null> = {};

  #interpreterAsyncFuncMap: Record<string, Function | null> = {};

  #interpreterConstMap: Record<string, Object | null> = {};

  #interPreterGlobalMap: Record<string, any> = {};

  #runningInfo: RunningInfo = {};

  #sandboxInfo: Record<string, number> = {};

  #stepAutoMillisecond = 100;

  #executable = false;

  constructor(props: CemBlocklyConstructor) {
    this.#rootElement = props.rootElement;
    this.#blockConfigs = props.blockConfigs;
    this.#cemStellarium = props.cemStellarium;
    this.#language = props.language || 'ko';
    this.eventManager = new EventManager();

    const toolbox = this.#getCategoryToolboxJson();
    this.#workspace = Blockly.inject(this.#rootElement, {
      ...BASE_OPTIONS,
      ...props.options,
      theme: customTheme,
      toolbox,
    } as BlocklyOptions as any);
    this.clear();
    this.#initializeButtonEvents();
    this.#initializeInterpreterMap();
    this.#setDefaultLocaleJSON();
    this.#initializeEventListener();
    window.addEventListener('resize', this.updateLayout.bind(this));
    const resizeObserver = new ResizeObserver(this.updateLayout.bind(this));
    const parent = this.#rootElement.offsetParent;
    parent && resizeObserver.observe(parent);

    const plugin = new CrossTabCopyPaste();
    plugin.init({
      contextMenu: false,
      shortcut: true,
    });

    this.updateLayout();
  }

  public updateLayout() {
    updateLayoutBlockly(this.#workspace)();
  }

  public changeLanguage(lang: Language) {
    const toolbox = this.#workspace.getToolbox() as any;
    const currentCategory = toolbox.getSelectedItem() as unknown as Blockly.ToolboxCategory;
    const position = toolbox.getToolboxItems().indexOf(currentCategory);
    const saveData = Blockly.serialization.workspaces.save(this.#workspace);

    this.#language = lang;
    this.#workspace.updateToolbox(this.#getCategoryToolboxJson());
    this.#setDefaultLocaleJSON();
    toolbox.selectItemByPosition(position);
    Blockly.serialization.workspaces.load(saveData, this.#workspace, { recordUndo: false });
  }

  public getJavascriptCode(withoutHightlightBlock = false, withoutSandbox = false) {
    if (withoutHightlightBlock) {
      javascriptGenerator.STATEMENT_PREFIX = null;
      javascriptGenerator.STATEMENT_SUFFIX = null;
    } else {
      javascriptGenerator.STATEMENT_PREFIX = 'highlightBlock(%1, true);\n';
      javascriptGenerator.STATEMENT_SUFFIX = 'highlightBlock(%1, false);\n';
    }
    javascriptGenerator.INFINITE_LOOP_TRAP = withoutSandbox ? '' : 'runInSandbox(%1);\n';
    return generateCode(this.#workspace);
  }

  public save() {
    const saveData = Blockly.serialization.workspaces.save(this.#workspace);
    return JSON.stringify(saveData);
  }

  public load(data: string, withClear = false) {
    if (!data) return false;
    const prevData = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.#workspace));
    try {
      const parsedData = JSON.parse(data);
      Blockly.serialization.workspaces.load(parsedData, this.#workspace, { recordUndo: false });
      if (!withClear) {
        this.#loadXML(prevData);
      }
      return true;
    } catch (e1) {
      try {
        if (withClear) {
          this.#workspace.clear();
        }
        this.#loadXML(data);
        return true;
      } catch (e2) {
        this.#workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(prevData), this.#workspace);
        console.warn(e2);
      }
    }
    return false;
  }

  public clear() {
    this.#workspace.clear();
    const startBlock = this.#workspace.newBlock(EventBlockType.START);
    startBlock.initSvg();
    startBlock.render();
  }

  public undo() {
    this.#workspace.undo(false);
  }

  public redo() {
    this.#workspace.undo(true);
  }

  public async runStartBlocks() {
    const { definition, codes } = this.getJavascriptCode(true);

    await this.#runTopblocks(definition, codes.filter(({ id }) => {
      const block = this.#workspace.getBlockById(id);
      return block?.type === EventBlockType.START;
    }));
  }

  public stopStartBlock() {
    this.#workspace.getTopBlocks(true)
      .filter((block) => block.type === EventBlockType.START)
      .map((block) => this.#runningInfo[block.id])
      .forEach((info) => {
        if (info) {
          info.paused = true;
        }
      });
  }

  public stopAll() {
    Object.entries(this.#runningInfo).forEach(([topblockId, info]) => {
      JsInterpreter.pauseInterpreter(info.interpreterId);
      info.paused = true;
      delete this.#runningInfo[topblockId];
    });
    this.#setHighlightBlock('');
    this.eventManager.emit('stop', EventBlockType.START);
    this.eventManager.emit('stepStop');
  }

  public stepStartBlock(auto = false) {
    const { definition, codes } = this.getJavascriptCode(false, true);
    const startBlockCodeInfo = codes.find(({ id }) => {
      const block = this.#workspace.getBlockById(id);
      return block?.type === EventBlockType.START;
    });
    if (!startBlockCodeInfo) return;

    const targetBlockId = startBlockCodeInfo.id;

    let interpreter = JsInterpreter.instanceMap.get(this.#runningInfo[targetBlockId]?.interpreterId);
    if (!interpreter) {
      let targetCode = definition + startBlockCodeInfo.code;
      targetCode = targetCode.replace(/waitForSeconds\(\d+(\.\d+)?, ?'.{0,30}'\);/g, '');
      interpreter = this.#getInterpreter(targetCode);
      this.#runningInfo[targetBlockId] = {
        interpreterId: interpreter.id,
        paused: false,
      };
      setTimeout(() => {
        this.#setHighlightBlock(targetBlockId);
      }, 0);
    }
    if (auto) {
      this.eventManager.emit('stepRunAuto');
    } else {
      this.eventManager.emit('stepRun');
    }

    const run = () => {
      const info = this.#runningInfo[targetBlockId];
      if (!info || !interpreter) {
        delete this.#runningInfo[targetBlockId];
        return;
      }
      const more = interpreter.step();

      if (!more) {
        delete this.#runningInfo[targetBlockId];
        this.eventManager.emit('stepStop');
      } else if (info.paused) {
        this.#setHighlightBlock(targetBlockId, false);
        if (auto) {
          setTimeout(run, this.#stepAutoMillisecond);
        }
      } else {
        run();
      }
    };
    run();
  }

  public pauseStepAutoStartBlock() {
    const startBlock = this.#workspace.getTopBlocks(true).find((block) => block.type === EventBlockType.START);
    if (!startBlock) return;
    const info = this.#runningInfo[startBlock.id];
    if (info) {
      info.paused = true;
      this.#setHighlightBlock('');
      JsInterpreter.pauseInterpreter(info.interpreterId);
      delete this.#runningInfo[startBlock.id];
      this.eventManager.emit('stepStop');
    }
  }

  async #excuteClickEventBlock(blockId: string) {
    const { definition, codes } = this.getJavascriptCode(true);

    await this.#runTopblocks(definition, codes.filter(({ id }) => {
      const block = this.#workspace.getBlockById(id);
      return block?.type === EventBlockType.EVENT_BLOCK_CLICK && id === blockId;
    }));
  }

  async #onGenerateEvent(name: string) {
    const { definition, codes } = this.getJavascriptCode(true);

    await this.#runTopblocks(definition, codes.filter(({ id }) => {
      const block = this.#workspace.getBlockById(id);
      if (block?.type !== EventBlockType.EVENT_GENERATE_RUN) return false;
      const eventName = block.data || '\'\'';
      const code = `setGlobalValue('eventName', ${eventName});`;
      const interpreter = this.#getInterpreter(definition + code);
      interpreter.run();
      const parsedName = interpreter.pseudoToNative(this.#interPreterGlobalMap.eventName || '');
      if (Array.isArray(parsedName)) {
        return parsedName.includes(name);
      }
      if (typeof parsedName === 'string') {
        return parsedName === name;
      }
      return false;
    }));
  }

  async #workspaceChangeEventHandler(workspaceChangeEvent: any) {
    if (workspaceChangeEvent.type === 'click') {
      const blockId = workspaceChangeEvent.blockId as string;
      const block = this.#workspace.getBlockById(blockId);
      if (block?.type === EventBlockType.EVENT_BLOCK_CLICK) {
        this.#excuteClickEventBlock(blockId);
      }
      if (block?.type === 'date_number') {
        const { left, top } = block.getBoundingRectangle();
        pickDate({
          x: left,
          y: top,
          callback(e: Event) {
            const input = e.currentTarget as HTMLInputElement;
            const value = dayjs(input.value).format('YYYY-MM-DD HH:mm:ss');
            block.setFieldValue(value, 'data');
          }
        });
      }
    }

    const topblocks = this.#workspace.getTopBlocks(false);
    const executable = topblocks.some((block) => block.type === EventBlockType.START && block.getChildren(false).length > 0);
    if (this.#executable !== executable) {
      this.eventManager.emit('changeExecutable', executable);
      this.#executable = executable;
    }
  }

  async #cemStellariumOnKeyboardEvent(e: KeyboardEvent) {
    const { definition, codes } = this.getJavascriptCode(true);

    await this.#runTopblocks(definition, codes.filter(({ id }) => {
      const block = this.#workspace.getBlockById(id);
      const keyCode = block?.getFieldValue('keyCode');
      return block?.type === EventBlockType.EVENT_KEYBOARD && e.key.toLowerCase() === keyCode;
    }));
  }

  #initializeEventListener() {
    this.#workspace.addChangeListener(this.#workspaceChangeEventHandler.bind(this));
    const observer = new IntersectionObserver((a) => {
      a.length && this.eventManager.emit('changeVisiblity', a[0].isIntersecting);
    });
    observer.observe(this.#workspace.svgBackground_.closest('svg')!);
    if (this.#cemStellarium) {
      this.#cemStellarium.engine.canvas.addEventListener('keydown', throttle(this.#cemStellariumOnKeyboardEvent.bind(this), this.eventThrottleMilliseconds));
    }
  }

  async #runTopblocks(
    definitionCode: string,
    codeInfos: { id: string; code: string; }[],
  ) {
    await Promise.all(codeInfos.map(async (info) => {
      const targetCode = definitionCode + info.code;
      const targetBlockId = info.id;
      this.#setHighlightBlock(targetBlockId);
      await this.#runTopblockCode(targetCode, targetBlockId);
    }));
  }

  #runTopblockCode(code: string, topblockId: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        const interpreter = this.#getInterpreter(code);
        this.#setRunningStateToStart(topblockId, interpreter.id);
        const run = () => {
          const info = this.#runningInfo[topblockId];
          if (info && info.interpreterId === interpreter.id && info.paused) {
            this.#setRunningStateToFinish(topblockId, interpreter.id);
            resolve();
            return;
          }

          const running = interpreter.run();
          if (running) {
            setTimeout(run, 0);
          } else {
            this.#setRunningStateToFinish(topblockId, interpreter.id);
            resolve();
          }
        };
        run();
      } catch (e) {
        reject(e);
      }
    });
  }

  #getInterpreter(code: string) {
    const interpreter = new JsInterpreter(code);
    Object.entries(this.#interpreterFuncMap).forEach(([name, func]) => {
      if (!func) throw new Error(`Does not define function of '${name}'`);
      interpreter.setFunctionGlobal(name, func);
    });
    Object.entries(this.#interpreterConstMap).forEach(([name, value]) => {
      if (!value) throw new Error(`Does not define value of '${name}'`);
      interpreter.setConstantGlobal(name, value);
    });
    Object.entries(this.#interpreterAsyncFuncMap).forEach(([name, value]) => {
      if (!value) throw new Error(`Does not define value of '${name}'`);
      interpreter.setAsyncFunctionGlobal(name, value);
    });
    return interpreter;
  }

  #loadXML(data: string) {
    const xml = Blockly.Xml.textToDom(data);
    Blockly.Xml.appendDomToWorkspace(xml, this.#workspace);
  }

  #setHighlightBlock(id: string, state?: boolean) {
    this.#workspace.highlightBlock(id, state);

    if (state !== undefined) {
      const topblockId = this.#workspace.getBlockById(id)?.getRootBlock().id || '';
      const info = this.#runningInfo[topblockId];
      if (info) {
        info.paused = state;
      } else {
        Object
          .values(this.#runningInfo)
          .forEach((runningInfo) => {
            runningInfo.paused = true;
          });
      }
    }
  }

  #setRunningStateToStart(topblockId: string, interpreterId: number) {
    const topblock = this.#workspace.getBlockById(topblockId);
    if (!topblock) return;
    this.eventManager.emit('run', topblock.type as EventBlockType);

    collectNextBlock(topblock).forEach((block) => this.#clearSandboxCount(block.id));

    if (this.#runningInfo[topblockId]) {
      JsInterpreter.pauseInterpreter(this.#runningInfo[topblockId].interpreterId);
    }
    this.#runningInfo[topblockId] = {
      interpreterId,
      paused: false,
    };
  }

  #setRunningStateToFinish(topblockId: string, interpreterId: number) {
    const info = this.#runningInfo[topblockId];
    if (info) {
      JsInterpreter.pauseInterpreter(info.interpreterId);
      delete this.#runningInfo[interpreterId];
    }
    this.#setHighlightBlock(topblockId, false);

    const topblock = this.#workspace.getBlockById(topblockId);
    if (!topblock) return;
    this.eventManager.emit('stop', topblock.type as EventBlockType);
  }

  #getCategoryToolboxJson() {
    const contents = this.#blockConfigs.map((category) => {
      if (category.type === 'contents') {
        category.contents.forEach((block) => {
          if (block.type === 'block-output' || block.type === 'block-statement' || block.type === 'block-built-in') {
            if (!block.colour) block.colour = category.colour;
            defineBlock(block, { forceOverride: true, language: this.#language });
          }
        });
      }
      return defineCategory(category, this.#language);
    });

    return {
      kind: 'categoryToolbox',
      contents,
    } as unknown as Blockly.utils.toolbox.ToolboxDefinition;
  }

  #initializeInterpreterMap() {
    this.#blockConfigs.forEach((category) => {
      if (category.type === 'contents') {
        category.contents.forEach((block) => {
          if (block.type === 'block-output' || block.type === 'block-statement') {
            if (block.excutes?.length) {
              block.excutes.forEach(({ name, excuteCemStellarium, excuteAsyncCemStellarium, excute, excuteAsync }) => {
                if (this.#cemStellarium && excuteCemStellarium) {
                  javascriptGenerator.addReservedWords(name);
                  this.#interpreterFuncMap[name] = this.#excuteCemStellariumWrap(excuteCemStellarium);
                }
                if (this.#cemStellarium && excuteAsyncCemStellarium) {
                  javascriptGenerator.addReservedWords(name);
                  this.#interpreterAsyncFuncMap[name] = this.#excuteCemStellariumWrap(excuteAsyncCemStellarium);
                }
                if (excuteAsync) {
                  javascriptGenerator.addReservedWords(name);
                  this.#interpreterAsyncFuncMap[name] = excuteAsync(this.#workspace, this.#runningInfo);
                }
                if (excute) {
                  javascriptGenerator.addReservedWords(name);
                  this.#interpreterFuncMap[name] = excute(this.#workspace, this.#runningInfo);
                }
              });
            }
          }
        });
      }
    });

    javascriptGenerator.addReservedWords('highlightBlock');
    this.#interpreterFuncMap.highlightBlock = this.#setHighlightBlock.bind(this);
    this.#interpreterFuncMap.getGlobalValue = this.#getinterPreterGlobalValue.bind(this);
    this.#interpreterFuncMap.setGlobalValue = this.#setinterPreterGlobalValue.bind(this);
    this.#interpreterFuncMap.clearSandboxCount = this.#clearSandboxCount.bind(this);
    this.#interpreterAsyncFuncMap.runInSandbox = this.#runInSandbox.bind(this);
    this.#interpreterAsyncFuncMap.alert = alert;
    this.#interpreterAsyncFuncMap.confirm = confirm;
    this.#interpreterAsyncFuncMap.prompt = prompt;
    this.#interpreterAsyncFuncMap.promptAsNumber = promptAsNumber;
    this.#interpreterFuncMap.generateEvent = this.#onGenerateEvent.bind(this);
  }

  #clearSandboxCount(blockId: string) {
    delete this.#sandboxInfo[blockId];
  }

  #runInSandbox(blockId: string, callback: Function) {
    if (!this.sandboxMode) return;
    this.#sandboxInfo[blockId] = (this.#sandboxInfo[blockId] ?? 0) + 1;

    if (this.#sandboxInfo[blockId] >= this.maxSandboxCount) {
      const conf = window.confirm(translateMessage(SANDBOX_MESSAGE, this.#language));
      if (!conf) {
        this.#clearSandboxCount(blockId);
        const topblock = this.#workspace.getBlockById(blockId)?.getRootBlock();
        if (!topblock) return;
        const info = this.#runningInfo[topblock.id];
        if (!info) return;
        this.#setRunningStateToFinish(topblock.id, info.interpreterId);
        return;
      }
      this.#sandboxInfo[blockId] = -4 * this.maxSandboxCount;
    }
    callback();
  }

  #getinterPreterGlobalValue(key: string) {
    return this.#interPreterGlobalMap[key];
  }

  #setinterPreterGlobalValue(key: string, value: any) {
    this.#interPreterGlobalMap[key] = value;
  }

  #excuteCemStellariumWrap(excuteCemStellariumFunc: <T>(excute: ExcuteCemStellariumFunc<T>) => Function) {
    return excuteCemStellariumFunc<any>((excutor) => {
      if (!this.#cemStellarium) return undefined;
      const result = excutor(this.#cemStellarium);
      return result;
    });
  }

  #setDefaultLocaleJSON() {
    if (this.#language === 'ko') {
      (Blockly as any).setLocale(KO);
      Blockly.Msg.PROCEDURE_VARIABLE = '인수:';
      Blockly.Msg.DUPLICATE_BLOCK_GROUP = '그룹 복제';
    }
    if (this.#language === 'en') {
      (Blockly as any).setLocale(EN);
      Blockly.Msg.PROCEDURE_VARIABLE = 'argument:';
      Blockly.Msg.DUPLICATE_BLOCK_GROUP = 'Duplicate Group';
    }
  }

  #initializeButtonEvents() {
    this.#blockConfigs.forEach((category) => {
      if (category.type === 'contents') {
        category.contents.forEach((content) => {
          if (content.type === 'button') {
            this.#workspace.registerButtonCallback(content.name, content.onClick);
          }
        });
      }
    });
  }

  cleanUpBlock() {
    this.#workspace.cleanUp();
  }
}

function alert(msg: string, callback: Function) {
  window.alert(msg);
  callback();
}

function confirm(msg: string, callback: Function) {
  callback(window.confirm(msg));
}

function prompt(msg: string, defaultValue: string, callback: Function) {
  callback(window.prompt(msg, defaultValue));
}

function promptAsNumber(msg: string, defaultValue: number, callback: Function) {
  callback(Number(window.prompt(msg, `${defaultValue}`)));
}
