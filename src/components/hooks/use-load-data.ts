import { readFileAsBinary } from "@/helper/read-file";
import { ACTIONS, useTypedDispatch, useTypedSelector } from "@/store";
import LZString from "lz-string";
import { useCallback } from "react"
import { useTranslation } from "react-i18next";

export const useLoadData = () => {
  const { cemStellarium, cemBlockly } = useTypedSelector(state => state.common);
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();

  const loadData = useCallback(async (file: File) => {
    if (!cemStellarium || !cemBlockly) return;
    function err() {
      window.alert(t('잘못된 형식의 파일입니다.'));
    }
    const buffer = await readFileAsBinary(file);
    const decompressed = LZString.decompressFromUint8Array(new Uint8Array(buffer));
    if (!decompressed) { err(); return; }

    const data = JSON.parse(decompressed);
    if (!data) { err(); return; }

    cemBlockly.stopAll();
    cemStellarium.load(data.s);
    cemBlockly.load(data.b, true);

    const names = file.name.split('.');
    const fileName = names.slice(0, names.length - 1).join('.');
    dispatch(ACTIONS.common.setTitle(fileName));
  }, [cemStellarium, cemBlockly, dispatch]);

  return loadData;
}