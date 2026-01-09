import { useState, useEffect } from 'react'
import { Clock, Calendar } from 'lucide-react'

const scheduleTypes = [
  { value: 'recurring', label: 'Recurring (Every X time)' },
  { value: 'specificDate', label: 'Specific Date & Time' },
  { value: 'cron', label: 'Cron Expression' },
]

const intervalOptions = [
  { value: '1m', label: 'Every 1 minute' },
  { value: '5m', label: 'Every 5 minutes' },
  { value: '15m', label: 'Every 15 minutes' },
  { value: '30m', label: 'Every 30 minutes' },
  { value: '1h', label: 'Every 1 hour' },
  { value: '6h', label: 'Every 6 hours' },
  { value: '12h', label: 'Every 12 hours' },
  { value: '1d', label: 'Every 1 day' },
  { value: '1w', label: 'Every 1 week' },
]

const timezones = [
  'UTC',
  'UTC+1',
  'UTC+2',
  'UTC+3',
  'UTC-5 (EST)',
  'UTC-8 (PST)',
]

export default function ScheduleTrigger({ config, onChange }) {
  const [scheduleType, setScheduleType] = useState(config.scheduleType || 'recurring')
  const [interval, setInterval] = useState(config.interval || '5m')
  const [specificDate, setSpecificDate] = useState(config.specificDate || '')
  const [specificTime, setSpecificTime] = useState(config.specificTime || '')
  const [cronExpression, setCronExpression] = useState(config.cronExpression || '0 * * * *')
  const [timezone, setTimezone] = useState(config.timezone || 'UTC+2')

  useEffect(() => {
    const newConfig = {
      scheduleType,
      timezone,
      ...(scheduleType === 'recurring' && { interval }),
      ...(scheduleType === 'specificDate' && { specificDate, specificTime }),
      ...(scheduleType === 'cron' && { cronExpression }),
    }
    onChange(newConfig)
  }, [scheduleType, interval, specificDate, specificTime, cronExpression, timezone])

  return (
    <div className="space-y-3!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Schedule Type
        </label>
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {scheduleTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {scheduleType === 'recurring' && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            <Clock size={14} className="inline! mr-1!" />
            Interval
          </label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          >
            {intervalOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {scheduleType === 'specificDate' && (
        <>
          <div>
            <label className="block! text-sm! text-[#999999]! mb-2!">
              <Calendar size={14} className="inline! mr-1!" />
              Date
            </label>
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
            />
          </div>
          <div>
            <label className="block! text-sm! text-[#999999]! mb-2!">
              <Clock size={14} className="inline! mr-1!" />
              Time
            </label>
            <input
              type="time"
              value={specificTime}
              onChange={(e) => setSpecificTime(e.target.value)}
              className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
            />
          </div>
        </>
      )}

      {scheduleType === 'cron' && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Cron Expression
          </label>
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="0 * * * *"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono!"
          />
          <p className="text-xs! text-[#666666]! mt-1!">
            Format: minute hour day month weekday
          </p>
          <div className="bg-[#2a2a3e]! rounded! p-2! mt-2! border! border-[#444]!">
            <p className="text-xs! text-[#999999]!">
              <strong>Examples:</strong><br/>
              <code className="text-[#85409D]!">0 * * * *</code> - Every hour<br/>
              <code className="text-[#85409D]!">*/15 * * * *</code> - Every 15 minutes<br/>
              <code className="text-[#85409D]!">0 9 * * 1-5</code> - 9 AM on weekdays
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <p className="text-xs! text-[#999999]!">
          {scheduleType === 'recurring' && `This workflow will run ${intervalOptions.find(o => o.value === interval)?.label.toLowerCase()}`}
          {scheduleType === 'specificDate' && specificDate && specificTime && 
            `This workflow will run once on ${specificDate} at ${specificTime}`}
          {scheduleType === 'cron' && `This workflow will run based on the cron expression: ${cronExpression}`}
        </p>
      </div>
    </div>
  )
}

ScheduleTrigger.defaultConfig = {
  scheduleType: 'recurring',
  interval: '5m',
  timezone: 'UTC+2'
}
