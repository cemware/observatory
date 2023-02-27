import { useTypedSelector } from "@/store";
import LZString from "lz-string";
import { useCallback } from "react";

export const useGetSaveData = () => {
  const { cemStellarium, cemBlockly } = useTypedSelector(state => state.common);

  const getSaveData = useCallback(() => {
    if (!cemStellarium || !cemBlockly) return undefined;
    const data = LZString.compressToUint8Array(JSON.stringify({
      s: cemStellarium.save(),
      b: cemBlockly.save(),
    }));
    return new Blob([data]);
  }, [cemStellarium, cemBlockly]);

  return getSaveData;
}