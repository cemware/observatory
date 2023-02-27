import * as Blockly from 'blockly';

export class CategoryRender extends Blockly.ToolboxCategory {
  init(): void {
    super.init();
    this.updateStyle();
  }

  private updateStyle() {
    const rowContentsContainerDiv = this.rowDiv_?.querySelector<HTMLDivElement>('.blocklyTreeRowContentContainer');
    const iconSpan = this.rowDiv_?.querySelector<HTMLSpanElement>('.blocklyTreeIcon');
    const labelSpan = this.rowDiv_?.querySelector<HTMLSpanElement>('.blocklyTreeLabel');

    if (this.rowDiv_) {
      this.rowDiv_.style.display = 'flex';
      this.rowDiv_.style.flexDirection = 'column';
      this.rowDiv_.style.justifyContent = 'center';
      this.rowDiv_.style.alignItems = 'center';
      this.rowDiv_.style.border = 'none';
      this.rowDiv_.style.cursor = 'pointer';
      this.rowDiv_.style.padding = '0';
      this.rowDiv_.style.width = '60px';
      this.rowDiv_.style.height = '66px';
    }

    if (rowContentsContainerDiv) {
      rowContentsContainerDiv.style.display = 'flex';
      rowContentsContainerDiv.style.flexDirection = 'column';
      rowContentsContainerDiv.style.justifyContent = 'center';
      rowContentsContainerDiv.style.alignItems = 'center';
    }

    if (iconSpan) {
      iconSpan.style.width = '38px';
      iconSpan.style.height = '38px';
      iconSpan.style.border = `1px solid ${this.colour_}`;
      iconSpan.style.borderRadius = '14px';
      iconSpan.style.backgroundColor = 'white';
      iconSpan.style.visibility = 'visible';
      iconSpan.style.boxSizing = 'border-box';
      iconSpan.style.backgroundImage = `url(${this.cssConfig_.openicon})`;
      iconSpan.style.backgroundPosition = 'center';
      iconSpan.style.backgroundSize = '40px';
    }

    if (labelSpan) {
      labelSpan.style.marginTop = '5px';
      labelSpan.style.fontSize = '11px';
    }
  }

  setSelected(isSelected: boolean): void {
    const iconSpan = this.rowDiv_?.querySelector<HTMLSpanElement>('.blocklyTreeIcon');
    if (iconSpan) {
      if (isSelected) {
        iconSpan.style.backgroundColor = this.colour_;
        iconSpan.style.backgroundImage = `url(${this.cssConfig_.closedicon})`;
      } else {
        iconSpan.style.backgroundColor = 'white';
        iconSpan.style.backgroundImage = `url(${this.cssConfig_.openicon})`;
      }
    }
  }
}
