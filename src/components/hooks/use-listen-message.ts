import { useCallback, useEffect } from "react";
import { useGetSaveData } from "./use-get-save-data";
import { useLoadData } from "./use-load-data";

export const useListenMessage = () => {
  const getSaveData = useGetSaveData();
  const loadData = useLoadData();

  const listenMessage = useCallback((event: MessageEvent) => {
    if (typeof event.data !== 'object') return;

    if (event.data.type === 'save') {
      const targetOrigin = event.data.origin;
      if (!targetOrigin) return;
      if (!event.source) return;

      const data = getSaveData();
      if (!data) return;

      event.source.postMessage({
        type: 'save-skydata',
        data,
      }, { targetOrigin });
    } else if (event.data.type === 'load') {
      const title = event.data.title;
      const blob = event.data.blob;
      if (blob instanceof Blob) {
        const file = new File([blob], title);
        loadData(file);
      }
    }
  }, [getSaveData, loadData]);

  useEffect(() => {
    window.addEventListener('message', listenMessage);
    return () => {
      window.removeEventListener('message', listenMessage);
    }
  }, [listenMessage]);
}