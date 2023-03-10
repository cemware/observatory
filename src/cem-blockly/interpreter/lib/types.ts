
/**
 * @license
 * JavaScript Interpreter
 *
 * Copyright 2013 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Interpreting JavaScript in JavaScript.
 * @author fraser@google.com (Neil Fraser)
 */
export declare class InterpreterType {
  /**
   * Create a new interpreter.
   * @param {string} code Raw JavaScript text.
   * @param {Function} opt_initFunc Optional initialization function.  Used to
   *     define APIs.  When called it is passed the interpreter object and the
   *     global scope object.
   * @constructor
   */
  constructor(code: string, opt_initFunc?: Function);

  /**
   * Execute one step of the interpreter.
   * @return {boolean} True if a step was executed, false if no more instructions.
   */
  step(): boolean;

  /**
   * Execute the interpreter to program completion.
   */
  run(): void;

  /**
   * Initialize the global scope with buitin properties and functions.
   * @param {!Object} scope Global scope.
   */
  initGlobalScope(scope: Object): void;

  /**
   * Initialize the Function class.
   * @param {!Object} scope Global scope.
   */
  initFunction(scope: Object): void;

  /**
   * Initialize the Object class.
   * @param {!Object} scope Global scope.
   */
  initObject(scope: Object): void;

  /**
   * Initialize the Array class.
   * @param {!Object} scope Global scope.
   */
  initArray(scope: Object): void;

  /**
   * Initialize the Number class.
   * @param {!Object} scope Global scope.
   */
  initNumber(scope: Object): void;

  /**
   * Initialize the String class.
   * @param {!Object} scope Global scope.
   */
  initString(scope: Object): void;

  /**
   * Initialize the Boolean class.
   * @param {!Object} scope Global scope.
   */
  initBoolean(scope: Object): void;

  /**
   * Initialize the Date class.
   * @param {!Object} scope Global scope.
   */
  initDate(scope: Object): void;

  /**
   * Initialize Math object.
   * @param {!Object} scope Global scope.
   */
  initMath(scope: Object): void;

  /**
   * Initialize Regular Expression object.
   * @param {!Object} scope Global scope.
   */
  initRegExp(scope: Object): void;

  /**
   * Initialize JSON object.
   * @param {!Object} scope Global scope.
   */
  initJSON(scope: Object): void;

  /**
   * Is an object of a certain class?
   * @param {Object} child Object to check.
   * @param {!Object} parent Class of object.
   * @return {boolean} True if object is the class or inherits from it.
   *     False otherwise.
   */
  isa(child: Object, parent: Object): boolean;

  /**
   * Compares two objects against each other.
   * @param {!Object} a First object.
   * @param {!Object} b Second object.
   * @return {number} -1 if a is smaller, 0 if a == b, 1 if a is bigger,
   *     NaN if they are not comparable.
   */
  comp(a: Object, b: Object): number;

  /**
   * Is a value a legal integer for an array?
   * @param {*} n Value to check.
   * @return {number} Zero, or a positive integer if the value can be
   *     converted to such.  NaN otherwise.
   */
  arrayIndex(n: any): number;

  /**
   * Create a new data object for a primitive.
   * @param {undefined|null|boolean|number|string} data Data to encapsulate.
   * @return {!Object} New data object.
   */
  createPrimitive(data: boolean|number|string): Object;

  /**
   * Create a new data object.
   * @param {Object} parent Parent constructor function.
   * @return {!Object} New data object.
   */
  createObject(parent: Object): Object;

  /**
   * Creates a new regular expression object.
   * @param {Object} obj The existing object to set.
   * @param {Object} data The native regular expression.
   * @return {!Object} New regular expression object.
   */
  createRegExp(obj: Object, data: Object): RegExp;

  /**
   * Create a new function.
   * @param {Object} node AST node defining the function.
   * @param {Object} opt_scope Optional parent scope.
   * @return {!Object} New function.
   */
  createFunction(node: Object, opt_scope: Object): Function;

  /**
   * Create a new native function.
   * @param {!Function} nativeFunc JavaScript function.
   * @return {!Object} New function.
   */
  createNativeFunction(nativeFunc: Function): Object;

  /**
   * Fetch a property value from a data object.
   * @param {!Object} obj Data object.
   * @param {*} name Name of property.
   * @return {!Object} Property value (may be UNDEFINED).
   */
  getProperty(obj: Object, name: any): Object;

  /**
   * Does the named property exist on a data object.
   * @param {!Object} obj Data object.
   * @param {*} name Name of property.
   * @return {boolean} True if property exists.
   */
  hasProperty(obj: Object, name: any): boolean;

  /**
   * Set a property value on a data object.
   * @param {!Object} obj Data object.
   * @param {*} name Name of property.
   * @param {*} value New property value.
   * @param {boolean} opt_fixed Unchangeable property if true.
   * @param {boolean} opt_nonenum Non-enumerable property if true.
   */
  setProperty(obj: Object, name: any, value: any, opt_fixed: boolean, opt_nonenum: boolean): void;

  /**
   * Delete a property value on a data object.
   * @param {!Object} obj Data object.
   * @param {*} name Name of property.
   */
  deleteProperty(obj: Object, name: any): void;

  /**
   * Returns the current scope from the stateStack.
   * @return {!Object} Current scope dictionary.
   */
  getScope(): Object;

  /**
   * Create a new scope dictionary.
   * @param {!Object} node AST node defining the scope container
   *     (e.g. a function).
   * @param {Object} parentScope Scope to link to.
   * @return {!Object} New scope.
   */
  createScope(node: Object, parentScope: Object): Object;

  /**
   * Retrieves a value from the scope chain.
   * @param {!Object} name Name of variable.
   * @throws {string} Error if identifier does not exist.
   */
  getValueFromScope(name: Object): string;

  /**
   * Sets a value to the current scope.
   * @param {!Object} name Name of variable.
   * @param {*} value Value.
   */
  setValueToScope(name: Object, value: any): void;

  /**
   * Gets a value from the scope chain or from an object property.
   * @param {!Object|!Array} left Name of variable or object/propname tuple.
   * @return {!Object} Value.
   */
  getValue(left: Object | Object[]): Object;

  /**
   * Sets a value to the scope chain or to an object property.
   * @param {!Object|!Array} left Name of variable or object/propname tuple.
   * @param {!Object} value Value.
   */
  setValue(left: Object | Object[], value: Object): void;
}

export interface InterpreterConstructor {
  new (code: string, opt_initFunc?: Function): InterpreterType;
}