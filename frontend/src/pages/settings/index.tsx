import { useState } from 'react'
import { InputNumber } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { DEFAULT_SETTINGS, type Settings } from '@/shared/config'
import {
  PageHeader,
  PageTitle,
  SaveButton,
  FieldList,
  FieldRow,
  FieldLabel,
  FieldUnit,
} from './styled'

const FIELDS: { key: keyof Settings; label: string; unit: string }[] = [
  { key: 'pomodoroDuration', label: 'Основной таймер', unit: 'мин' },
  { key: 'shortBreakDuration', label: 'Короткий перерыв', unit: 'мин' },
  { key: 'longBreakDuration', label: 'Длинный перерыв', unit: 'мин' },
  { key: 'cycleLength', label: 'Длина цикла', unit: 'шт' },
]

export const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const isDirty = FIELDS.some(({ key }) => settings[key] !== DEFAULT_SETTINGS[key])

  const handleChange = (key: keyof Settings, value: number | null) => {
    if (value === null) return
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (!isDirty) return
    console.log('save', settings)
  }

  return (
    <div>
      <PageHeader>
        <PageTitle>Настройки</PageTitle>
        <SaveButton $dirty={isDirty} onClick={handleSave} title="Сохранить">
          <SaveOutlined />
        </SaveButton>
      </PageHeader>
      <FieldList>
        {FIELDS.map(({ key, label, unit }) => (
          <FieldRow key={key}>
            <FieldLabel>{label}</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <InputNumber
                min={1}
                max={120}
                value={settings[key]}
                onChange={(v) => handleChange(key, v)}
                size="small"
                style={{ width: 64 }}
              />
              <FieldUnit>{unit}</FieldUnit>
            </div>
          </FieldRow>
        ))}
      </FieldList>
    </div>
  )
}
