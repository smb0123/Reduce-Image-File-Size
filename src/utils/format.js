import { EXTENSIONS } from '../constants';

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}

export function outputName(fileName, type) {
  const base = fileName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${EXTENSIONS[type]}`;
}

// 변환이 끝난 항목에 겹치지 않는 출력 파일명(outName)을 붙여 돌려줍니다.
export function assignOutputNames(items) {
  const used = new Set();
  return items.map((item) => {
    if (!item.blob) return item;
    let name = outputName(item.file.name, item.outType);
    const dot = name.lastIndexOf('.');
    const stem = name.slice(0, dot);
    const ext = name.slice(dot);
    for (let n = 2; used.has(name.toLowerCase()); n++) name = `${stem}-${n}${ext}`;
    used.add(name.toLowerCase());
    return { ...item, outName: name };
  });
}
