import FormatField from './settings/FormatField';
import SizeFields from './settings/SizeFields';
import StrengthField from './settings/StrengthField';

export default function SettingsPanel({ settings, onChange }) {
  return (
    <aside className="panel">
      <FormatField />
      <SizeFields settings={settings} onChange={onChange} />
      <StrengthField value={settings.quality} onChange={onChange} />
    </aside>
  );
}
