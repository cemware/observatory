import { BlockCategory, CategoryContents, Language } from '../types';
import { injectBlocklyCss } from './css';
import { translateMessage } from './utils';

export function defineCategory(category: BlockCategory, language: Language) {
  const categoryConfig: Record<string, any> = {
    kind: 'category',
    name: translateMessage(category.name, language),
    colour: `${category.colour}`,
    cssConfig: {
      container: `blocklyToolboxCategory ${translateMessage(category.name, 'en')}`,
      openicon: category.categoryIcon[1],
      closedicon: category.categoryIcon[0],
    },
  };
  if (category.type === 'contents') {
    const contents = category.contents.map((content) => defineCategoryItem(content, language));
    categoryConfig.contents = contents;
  }
  if (category.type === 'custom') {
    categoryConfig.custom = category.custom;
  }

  return categoryConfig;
}

function defineCategoryItem(item: CategoryContents, language: Language) {
  if (item.type === 'block-built-in') {
    if (item._DEPRECATED) return { kind: '' };
    return {
      kind: 'block',
      type: item.name,
      style: item.style,
      inline: item.inputsInline,
      extraState: item.extraState,
      disabled: item.disabled ? 'true' : 'false',
    };
  }
  if (item.type === 'block-output' || item.type === 'block-statement') {
    if (item._DEPRECATED) return { kind: '' };
    return {
      kind: 'block',
      type: item.name,
      inputs: item.presetInputs,
      fields: item.presetFields,
      disabled: item.disabled ? 'true' : 'false',
    };
  }

  if (item.type === 'label') {
    let className = '';
    if (item.style) {
      className = item.name;
      const { fontSize, fontFamily, fontWeight, color } = item.style;
      injectBlocklyCss(className, `
        .blocklyFlyoutLabel.${className} > .blocklyFlyoutLabelText {
          ${fontSize ? `font-size: ${fontSize};` : ''}
          ${fontFamily ? `font-family: ${fontFamily};` : ''}
          ${fontWeight ? `font-weight: ${fontWeight};` : ''}
          ${color ? `fill: ${color};` : ''}
        }
      `);
    }
    return {
      kind: 'label',
      text: translateMessage(item.text, language),
      'web-class': className,
    };
  }

  if (item.type === 'seperator') {
    return {
      kind: 'sep',
      gap: item.gap,
    };
  }

  if (item.type === 'button') {
    return {
      kind: 'button',
      type: item.name,
      callbackKey: item.name,
      text: translateMessage(item.text, language),
    };
  }
}
