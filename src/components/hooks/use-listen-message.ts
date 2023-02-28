import { useTypedSelector } from "@/store";
import { useCallback, useEffect } from "react";
import { useGetSaveData } from "./use-get-save-data";
import { useLoadData } from "./use-load-data";

export const useListenMessage = () => {
  const { cemStellarium } = useTypedSelector((state) => state.common);
  const getSaveData = useGetSaveData();
  const loadData = useLoadData();

  const listenMessage = useCallback((event: MessageEvent) => {
    if (typeof event.data !== 'object') return;

    if (event.data.type === 'save') {
      const targetOrigin = event.data.origin;
      if (!targetOrigin) return;
      if (!event.source) return;
      if (!event.data.id) return;
      if (!cemStellarium) return;

      const data = getSaveData();
      if (!data) return;
      const screenshot = cemStellarium.engine.canvas.toDataURL();

      event.source.postMessage({
        type: 'observatory-save',
        id: event.data.id,
        data,
        screenshot,
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