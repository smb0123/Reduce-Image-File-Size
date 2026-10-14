import { useCallback, useState } from 'react';
import { DEFAULT_SETTINGS } from './constants';
import { useImageQueue } from './hooks/useImageQueue';
import { downloadZip } from './utils/zip';
import SettingsPanel from './components/SettingsPanel';
import DropZone from './components/DropZone';
import Toolbar from './components/Toolbar';
import FileList from './components/FileList';

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [zipping, setZipping] = useState(false);
  const queue = useImageQueue(settings);

  const updateSettings = useCallback((changes) => setSettings((s) => ({ ...s, ...changes })), []);

  const handleZip = async () => {
    setZipping(true);
    try {
      await downloadZip(queue.items.filter((i) => i.blob));
    } catch {
      alert('ZIP을 만들지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="wrap">
      <h1>사진 용량 줄이기</h1>
      <p className="lead">
        용량을 최대한 줄이고, 크기 조절과 형식 변환도 한 번에 처리해요. 모든 작업은 이 브라우저 안에서만 이루어지고 사진은 서버로 올라가지 않아요.
      </p>
      <div className="grid">
        <SettingsPanel settings={settings} onChange={updateSettings} />
        <main>
          <DropZone onFiles={queue.addFiles} />
          <Toolbar
            items={queue.items}
            busy={queue.busy}
            zipping={zipping}
            onRerun={queue.rerunAll}
            onZip={handleZip}
            onClear={queue.clear}
          />
          <FileList items={queue.items} onRemove={queue.remove} />
        </main>
      </div>
    </div>
  );
}
