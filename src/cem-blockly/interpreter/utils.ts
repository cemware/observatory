const goodFuncNameRegex = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
export function isGoodFuncName(funcName: string) {
  return goodFuncNameRegex.test(funcName);
}
