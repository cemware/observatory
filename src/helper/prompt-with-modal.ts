import { CSSProperties } from "react";

interface PromptProps {
  description: string;
  defaultValue?: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  ext?: string;
}

export function promptWithModal({
  description,
  confirmButtonLabel,
  cancelButtonLabel,
  defaultValue = '',
  ext = '',
}: PromptProps) {
  return new Promise<string | null>((resolve) => {

    const $overlay = createElement('div', overlayStyle, '', { id: 'prompt-with-modal' });
    const $modalWrapper = createElement('div', modalWrapperStyle);
    const $desc = createElement('div', descStyle, description);
    const $inputWrapper = createElement('div', inputWrapperStyle);
    const $input = createElement('input', inputStyle, '', {
      type: 'text',
      value: defaultValue,
      spellCheck: 'false',
    });
    $input.value = defaultValue;
    const $placeholder = createElement('input', placeHolderStyle, '', {
      type: 'text',
      placeholder: `${defaultValue}.${ext}`,
      readonly: 'true',
      spellCheck: 'false',
    });
    $placeholder.value = `${defaultValue}.${ext}`;

    const $buttonWrap = createElement('div', buttonWrapStyle);

    const $cancelButton = createElement('button', cancelButtonStyle, cancelButtonLabel);
    const $confirmButton = createElement('button', confirmButtonStyle, confirmButtonLabel);

    $overlay.onmousedown = (e: MouseEvent) => {
      if (e.currentTarget === e.target) {
        $overlay.remove();
        resolve(null);
      }
    }
    $cancelButton.onclick = () => {
      $overlay.remove();
      resolve(null);
    }
    $confirmButton.onclick = () => {
      $overlay.remove();
      resolve($input.value);
    }

    $input.oninput = () => {
      $placeholder.value = $input.value ? `${$input.value}.${ext}` : '';
    }

    $inputWrapper.appendChild($placeholder);
    $inputWrapper.appendChild($input);

    $buttonWrap.appendChild($cancelButton);
    $buttonWrap.appendChild($confirmButton);

    $modalWrapper.appendChild($desc);
    $modalWrapper.appendChild($inputWrapper);
    $modalWrapper.appendChild($buttonWrap);

    $overlay.appendChild($modalWrapper);

    document.body.appendChild($overlay);

    $input.focus();
    $input.selectionStart = $input.value.length;
  });
}

function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, style?: CSSProperties, innerHTML?: string, attributes?: Record<string, string>) {
  const $element = document.createElement(tagName);
  if (style) Object.assign($element.style, style);
  if (innerHTML) $element.innerHTML = innerHTML;
  if (attributes) Object.entries(attributes).forEach(([k, v]) => $element.setAttribute(k, v));
  return $element;
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  zIndex: '9999',
  backgroundColor: '#00000096',
  backdropFilter: 'blur(2px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  userSelect: 'none',
}

const modalWrapperStyle: CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  backgroundColor: 'white',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
}

const descStyle: CSSProperties = {
  fontSize: '16px',
  fontWeight: '500',
}

const inputWrapperStyle: CSSProperties = {
  position: 'relative',
}

const inputStyle: CSSProperties = {
  border: '1px solid #BABCC2',
  padding: '12px',
  fontSize: '14px',
  borderRadius: '5px',
  backgroundColor: 'transparent',
  outline: 'none',
  marginTop: '10px',
  width: '400px',
  height: '20px',
}

const placeHolderStyle: CSSProperties = {
  ...inputStyle,
  color: '#80808087',
  position: 'absolute',
  top: '0',
  left: '0',
  userSelect: 'none',
  pointerEvents: 'none',
}

const buttonWrapStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '8px',
}

const buttonStyle: CSSProperties = {
  fontSize: '14px',
  whiteSpace: 'nowrap',
  boxShadow: 'rgb(0 0 0 / 16%) 0px 3px 6px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  border: 'none',
  width: '100px',
  padding: '8px 0',
};

const confirmButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#5754e0',
  marginLeft: '8px',
}

const cancelButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#8e9bae',
}