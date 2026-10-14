import { formatBytes } from '../utils/format';

function statusMessage(item, ratio) {
  if (item.status === 'busy') return { text: '변환 중…', tone: '' };
  if (item.status === 'error') return { text: item.note, tone: 'err' };
  if (item.status === 'done') {
    const prefix = ratio < 100 ? `원본의 ${ratio}%로 줄었어요. ` : '';
    return { text: prefix + item.note, tone: item.tone };
  }
  return { text: '대기 중', tone: '' };
}

export default function FileItem({ item, onRemove }) {
  const done = item.status === 'done';
  const ratio = done ? Math.round((item.blob.size / item.file.size) * 100) : 0;
  const { text, tone } = statusMessage(item, ratio);

  return (
    <li className="file-item">
      <img src={item.thumb} alt="" />
      <div className="file-info">
        <div className="file-name" title={item.file.name}>{item.file.name}</div>
        <div className="file-sub">
          {item.width > 0 && <span>{item.width}×{item.height}px</span>}
          <span>{formatBytes(item.file.size)}</span>
          {done && <span>→ <b>{item.outWidth}×{item.outHeight}px</b></span>}
          {done && <span>→ <b>{formatBytes(item.blob.size)}</b></span>}
        </div>
        {done && (
          <div className="meter"><i style={{ width: `${Math.min(100, ratio)}%` }} /></div>
        )}
        <div className={`file-note ${tone}`}>{text}</div>
      </div>
      <div className="file-actions">
        {done && <a href={item.url} download={item.outName}>받기</a>}
        <button onClick={() => onRemove(item.id)} aria-label={`${item.file.name} 삭제`}>삭제</button>
      </div>
    </li>
  );
}
