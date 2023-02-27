export function saveAsFile(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);

  const anchorElem = document.createElement('a');
  anchorElem.style.display = 'none';
  anchorElem.href = url;
  anchorElem.download = fileName;

  document.body.appendChild(anchorElem);
  anchorElem.click();
  document.body.removeChild(anchorElem);

  setTimeout(() => { window.URL.revokeObjectURL(url); }, 1000);
};