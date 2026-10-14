import { useEffect, useRef, useState } from 'react';

export default function DropZone({ onFiles }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  // Ctrl+V 붙여넣기 지원
  useEffect(() => {
    const onPaste = (e) => e.clipboardData.files.length && onFiles(e.clipboardData.files);
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onFiles]);

  // 영역 밖에 떨어뜨렸을 때 브라우저가 사진을 열어버리는 것을 막습니다.
  useEffect(() => {
    const stop = (e) => e.preventDefault();
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);

  const open = () => inputRef.current.click();

  return (
    <div
      className={`dropzone${over ? ' over' : ''}`}
      tabIndex={0}
      role="button"
      aria-label="사진 선택"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(e.dataTransfer.files);
      }}
    >
      <strong>사진을 여기로 끌어놓거나 눌러서 선택</strong>
      <span>여러 장을 한 번에 올릴 수 있어요.</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
