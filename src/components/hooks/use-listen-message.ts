import { IStoreState, useTypedSelector } from "@/store";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "react-redux";
import { useGetSaveData } from "./use-get-save-data";
import { useLoadData } from "./use-load-data";

export const useListenMessage = () => {
  const { cemStellarium, executable } = useTypedSelector((state) => state.common);
  const getSaveData = useGetSaveData();
  const loadData = useLoadData();
  const { i18n } = useTranslation();
  const store = useStore<IStoreState, any>();

  const listenMessage = useCallback((event: MessageEvent) => {
    if (!store.getState().common.cemStellarium || !store.getState().common.cemBlockly) {
      const interval = setInterval(() => {
        if (!store.getState().common.cemStellarium || !store.getState().common.cemBlockly) return;
        clearInterval(interval);
        window.dispatchEvent(new MessageEvent('message', { data: event.data }));
      }, 1);
      return;
    }

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
    } else if (event.data.type === 'change-language') {
      i18n.changeLanguage(event.data.data);
    } else if (event.data.type === 'is-executable-block') {
      const targetOrigin = event.data.origin;
      if (!targetOrigin) return;
      if (!event.source) return;
      if (!event.data.id) return;

      event.source.postMessage({
        type: 'observatory-executable-block',
        id: event.data.id,
        data: executable,
      }, { targetOrigin });

    }
  }, [getSaveData, loadData, executable]);

  useEffect(() => {
    window.addEventListener('message', listenMessage);
    return () => {
      window.removeEventListener('message', listenMessage);
    }
  }, [listenMessage]);
}