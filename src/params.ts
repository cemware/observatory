const usp = new URLSearchParams(window.location.search);
const noHeader = usp.get('noHeader');
const noSettingButton = usp.get('noSettingButton');
const noFullscreenButton = usp.get('noFullscreenButton');
const noBlockcodingButton = usp.get('noBlockcodingButton');
const noBlockcodingRunButton = usp.get('noBlockcodingRunButton');

export const params = {
  noHeader: noHeader === 'true',
  noSettingButton: noSettingButton === 'true',
  noFullscreenButton: noFullscreenButton === 'true',
  noBlockcodingButton: noBlockcodingButton === 'true',
  noBlockcodingRunButton: noBlockcodingRunButton === 'true',
}