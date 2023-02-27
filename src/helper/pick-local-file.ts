export function pickLocalFile(accept?: string) {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.type = 'blob';
    input.setAttribute('type', 'file');
    input.setAttribute('style', 'display:none');
    if (accept) {
      input.setAttribute('accept', accept);
    }
    document.body.appendChild(input);
    input.click();
    input.addEventListener('change', (e: any) => {
      if (e.currentTarget.files?.length) {
        const file = e.currentTarget.files[0];
        resolve(file);
      }
      reject();
    });
    document.body.removeChild(input);
  });
}