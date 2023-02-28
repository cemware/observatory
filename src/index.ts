import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app";
import { i18nGlobal } from "./i18n";

i18nGlobal.then(() => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(React.createElement(App));
  }
});