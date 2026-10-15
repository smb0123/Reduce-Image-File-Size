import { useCallback, useMemo, useRef, useState } from 'react';
import { convertImage, readImageSize } from '../utils/imageProcessor';
import { assignOutputNames } from '../utils/format';

const READ_ERROR = '이 파일은 읽을 수 없어요. HEIC는 지원하지 않아요.';
const tick = () => new Promise((r) => setTimeout(r));

/**
 * 사진 목록과 변환 큐를 관리합니다.
 * items 각 항목: { id, file, thumb, width, height, status, blob, url, outWidth, outHeight, note, tone, outName }
 * status: wait(대기) | busy(변환 중) | done(완료) | error(오류)
 */
export function useImageQueue(settings) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const listRef = useRef([]); // 항상 최신 목록 (비동기 루프에서 읽기 위해)
  const settingsRef = useRef(settings);
  const busyRef = useRef(false);
  const nextId = useRef(0);
  settingsRef.current = settings;

  const commit = useCallback((updater) => {
    listRef.current = updater(listRef.current);
    setItems(listRef.current);
  }, []);
  const patch = useCallback(
    (id, changes) => commit((list) => list.map((i) => (i.id === id ? { ...i, ...changes } : i))),
    [commit]
  );

  const revoke = (item) => item.url && URL.revokeObjectURL(item.url);

  const run = useCallback(
    async (all = false) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      if (all) {
        commit((list) =>
          list.map((i) => {
            if (i.unreadable) return i;
            revoke(i);
            return { ...i, status: 'wait', blob: null, url: null, note: '' };
          })
        );
      }
      try {
        let item;
        while ((item = listRef.current.find((i) => i.status === 'wait'))) {
          const s = settingsRef.current;
          patch(item.id, { status: 'busy' });
          try {
            const r = await convertImage(item.file, item, s);
            if (listRef.current.some((i) => i.id === item.id)) {
              patch(item.id, {
                status: 'done',
                blob: r.blob,
                url: URL.createObjectURL(r.blob),
                outWidth: r.width,
                outHeight: r.height,
                note: r.note,
                tone: r.tone,
              });
            }
          } catch {
            patch(item.id, { status: 'error', note: '변환하지 못했어요. 다른 사진으로 다시 시도해 주세요.' });
          }
          await tick();
        }
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [commit, patch]
  );

  const addFiles = useCallback(
    async (fileList) => {
      const files = [...fileList].filter((f) => f.type.startsWith('image/'));
      for (const file of files) {
        const item = { id: ++nextId.current, file, thumb: URL.createObjectURL(file), status: 'wait', note: '' };
        try {
          Object.assign(item, await readImageSize(file));
        } catch {
          Object.assign(item, { width: 0, height: 0, status: 'error', unreadable: true, note: READ_ERROR });
        }
        commit((list) => [...list, item]);
      }
      run(false);
    },
    [commit, run]
  );

  const remove = useCallback(
    (id) =>
      commit((list) => {
        const target = list.find((i) => i.id === id);
        if (target) {
          revoke(target);
          URL.revokeObjectURL(target.thumb);
        }
        return list.filter((i) => i.id !== id);
      }),
    [commit]
  );

  const clear = useCallback(
    () =>
      commit((list) => {
        list.forEach((i) => {
          revoke(i);
          URL.revokeObjectURL(i.thumb);
        });
        return [];
      }),
    [commit]
  );

  const namedItems = useMemo(() => assignOutputNames(items), [items]);
  return { items: namedItems, busy, addFiles, remove, clear, rerunAll: () => run(true) };
}
