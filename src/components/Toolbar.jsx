import { formatBytes } from '../utils/format';

function Summary({ items }) {
  const done = items.filter((i) => i.blob);
  if (!done.length) return null;
  const before = done.reduce((n, i) => n + i.file.size, 0);
  const after = done.reduce((n, i) => n + i.blob.size, 0);
  const saved = before ? Math.round((1 - after / before) * 100) : 0;
  return <span className="summary">{`${done.length}장 완료, ${formatBytes(before)} → ${formatBytes(after)} (${saved}% 감소)`}</span>;
}

export default function Toolbar({ items, busy, zipping, onRerun, onZip, onClear }) {
  const hasDone = items.some((i) => i.blob);
  return (
    <div className="toolbar">
      <button className="primary" onClick={onRerun} disabled={!items.length || busy}>설정대로 다시 변환</button>
      <button onClick={onZip} disabled={!hasDone || zipping}>{zipping ? 'ZIP 만드는 중…' : 'ZIP으로 모두 받기'}</button>
      <button onClick={onClear} disabled={!items.length}>모두 지우기</button>
      <Summary items={items} />
    </div>
  );
}
