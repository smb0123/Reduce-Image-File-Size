import { STRENGTH_OPTIONS } from '../../constants';

export default function StrengthField({ value, onChange }) {
  return (
    <fieldset>
      <legend>압축 강도</legend>
      <select value={value} onChange={(e) => onChange({ quality: Number(e.target.value) })} aria-label="압축 강도">
        {STRENGTH_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <p className="hint">
        어떤 설정이든 결과는 항상 1MB 아래로 나와요. 1MB를 넘으면 화질을 더 낮추고, 그래도 넘으면 크기를 자동으로 줄여요.
        단, 픽셀로 크기를 직접 지정했다면 그 크기를 유지해요.
      </p>
    </fieldset>
  );
}
