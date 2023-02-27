import Interpreter from './lib/interpreter';
import { isGoodFuncName } from './utils';

export type InterpreterSetterOption =
  'get' | 'set' | 'configurable' | 'enumerable' | 'writable' | 'value';

export class JsInterpreter {
  static #instanceCount = 1;

  public static instanceMap = new Map<number, JsInterpreter>();

  public id = 1;

  public namespaces: JsInterpreterNamespace[];

  #globalObject: any;

  #interpreter: any;

  constructor(code: string) {
    this.#interpreter = new Interpreter(code, (_: any, globalObject: any) => {
      this.#globalObject = globalObject;
    });
    this.namespaces = [];
    this.id = JsInterpreter.#instanceCount;
    JsInterpreter.instanceMap.set(this.id, this);
    JsInterpreter.#instanceCount += 1;
  }

  public static pauseInterpreter(interpreterId: number) {
    const interpreter = JsInterpreter.instanceMap.get(interpreterId);
    if (interpreter) {
      interpreter.#interpreter.paused_ = true;
    }
  }

  public isPaused() {
    return this.#interpreter.paused_;
  }

  public step(): boolean {
    return this.#interpreter.step();
  }

  public run(): boolean {
    return this.#interpreter.run();
  }

  public setFunctionGlobal(functionName: string, func: Function, option?: InterpreterSetterOption[]) {
    if (!isGoodFuncName(functionName)) throw new Error(`'${functionName}' cannot be used for function name.`);
    const nativeFunction = this.#interpreter.createNativeFunction(func);
    this.#interpreter.setProperty(this.#globalObject, functionName, nativeFunction, option);
  }

  public setConstantGlobal(constantName: string, value: any, option?: InterpreterSetterOption[]) {
    if (!isGoodFuncName(constantName)) throw new Error(`'${constantName}' cannot be used for variable name.`);
    this.#interpreter.setProperty(this.#globalObject, constantName, value, option);
  }

  public setAsyncFunctionGlobal(functionName: string, func: Function) {
    if (!isGoodFuncName(functionName)) throw new Error(`'${functionName}' cannot be used for function name.`);
    this.#interpreter.setProperty(this.#globalObject, functionName, this.#interpreter.createAsyncFunction(func));
  }

  public createNamespace(name: string): JsInterpreterNamespace {
    const scope = this.#interpreter.getProperty(this.#interpreter.global, name);
    const namespace = new JsInterpreterNamespace(this.#interpreter, name, scope);
    this.namespaces.push(namespace);
    return namespace;
  }

  public pseudoToNative(pseudoObj: any, opt_cycles?: any) {
    return this.#interpreter.pseudoToNative(pseudoObj, opt_cycles);
  }

  public nativeToPseudo(pseudoObj: any) {
    return this.#interpreter.nativeToPseudo(pseudoObj);
  }
}

export class JsInterpreterNamespace {
  #interpreter: any;

  #name: string;

  #scope: any;

  constructor(interpreter: any, name: string, scope?: any) {
    this.#interpreter = interpreter;
    this.#name = name;
    if (scope) {
      this.#scope = scope;
    } else {
      this.#scope = this.#interpreter.createObjectProto(this.#interpreter.OBJECT_PROTO);
      this.#interpreter.setProperty(this.#interpreter.global, this.#name, this.#scope);
    }
  }

  public setFunction(functionName: string, func: Function, option?: InterpreterSetterOption[]) {
    if (!isGoodFuncName(functionName)) throw new Error(`'${functionName}' cannot be used for function name.`);
    const nativeFunction = this.#interpreter.createNativeFunction(func);
    this.#interpreter.setProperty(this.#scope, functionName, nativeFunction, option);
  }

  public setConstant(constantName: string, value: any, option?: InterpreterSetterOption[]) {
    if (!isGoodFuncName(constantName)) throw new Error(`'${constantName}' cannot be used for variable name.`);
    this.#interpreter.setProperty(this.#scope, constantName, value, option);
  }
}
