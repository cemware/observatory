import * as Blockly from 'blockly';

export function updateLayoutBlockly(workspace: Blockly.WorkspaceSvg) {
  return () => {
    const root = workspace.getInjectionDiv() as HTMLElement;
    const parent = root.offsetParent as HTMLElement;
    if (parent) {
      root.style.width = `${parent.offsetWidth}px`;
      root.style.height = `${parent.offsetHeight}px`;
    }
    Blockly.svgResize(workspace);
  };
}
