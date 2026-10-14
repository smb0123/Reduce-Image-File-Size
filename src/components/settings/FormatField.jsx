import { useMemo } from 'react';
import { AVIF_OPTION, FORMAT_OPTIONS } from '../../constants';
import { supportsAvif } from '../../utils/imageProcessor';

const HINTS = {
  'image/png': 'PNG는 화질로 줄일 수 없어서 용량이 큰 편이에요. 가장 많이 줄이려면 WebP나 JPG를 추천해요.',
  'image/jpeg': '투명한 부분은 흰색으로 채워져요.',
};

export default function FormatField({ value, onChange }) {
  // AVIF는 브라우저가 지원할 때만 보여줍니다.
  const options = useMemo(() => (supportsAvif() ? [...FORMAT_OPTIONS, AVIF_OPTION] : FORMAT_OPTIONS), []);
  return (
    <fieldset>
      <legend>출력 형식</legend>
      <select value={value} onChange={(e) => onChange({ type: e.target.value })} aria-label="출력 형식">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {HINTS[value] && <p className="hint">{HINTS[value]}</p>}
    </fieldset>
  );
}
