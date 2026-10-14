import { FIT_OPTIONS, SIZE_MODES } from '../../constants';

export default function SizeFields({ settings, onChange }) {
  const { sizeMode, width, height, percent, fit } = settings;
  return (
    <fieldset>
      <legend>너비와 높이</legend>
      <select value={sizeMode} onChange={(e) => onChange({ sizeMode: e.target.value })} aria-label="크기 방식">
        {SIZE_MODES.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {sizeMode === 'px' && (
        <div className="size-box">
          <div className="row2">
            <label>
              너비(px)
              <input type="number" min="1" placeholder="자동" value={width} onChange={(e) => onChange({ width: e.target.value })} />
            </label>
            <label>
              높이(px)
              <input type="number" min="1" placeholder="자동" value={height} onChange={(e) => onChange({ height: e.target.value })} />
            </label>
          </div>
          <label>
            둘 다 입력했을 때 맞추는 방법
            <select value={fit} onChange={(e) => onChange({ fit: e.target.value })}>
              {FIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <p className="hint">
            한 칸만 입력하면 비율에 맞춰 나머지가 자동 계산돼요. 크기를 지정하면 1MB가 넘어도 그 크기를 유지하고 화질만 낮춰요.
          </p>
        </div>
      )}

      {sizeMode === 'pct' && (
        <div className="size-box">
          <label>
            비율(%)
            <input type="number" min="1" max="100" value={percent} onChange={(e) => onChange({ percent: e.target.value })} />
          </label>
        </div>
      )}
    </fieldset>
  );
}
