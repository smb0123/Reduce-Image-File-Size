import JSZip from 'jszip';

export async function downloadZip(items, zipName = 'images.zip') {
  const zip = new JSZip();
  items.forEach((item) => zip.file(item.outName, item.blob));
  // 이미지는 이미 압축된 파일이라 ZIP 압축 없이(STORE) 묶는 편이 빠릅니다.
  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
