const usp = new URLSearchParams(window.location.search);
const noHeader = usp.get('noHeader');

export interface Params {
  noHeader: boolean;
}
export const params: Params = {
  noHeader: noHeader === 'true',
}