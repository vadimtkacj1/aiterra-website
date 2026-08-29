'use client'

import {
  Check,
  ExternalLink,
  Hand,
  ListChecks,
  Monitor,
  MousePointerClick,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { DEVICES, PAGES, type DeviceId, type EditorMode } from './config'

const gradient = 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)'

const DEVICE_ICONS = { desktop: Monitor, laptop: Monitor, tablet: Tablet, mobile: Smartphone }

export default function LiveToolbar({
  page,
  onPage,
  device,
  onDevice,
  mode,
  onMode,
  changeCount,
  panelOpen,
  onPanel,
  onSave,
  onDiscard,
  saving,
  justSaved,
}: {
  page: string
  onPage: (value: string) => void
  device: DeviceId
  onDevice: (value: DeviceId) => void
  mode: EditorMode
  onMode: (value: EditorMode) => void
  changeCount: number
  panelOpen: boolean
  onPanel: () => void
  onSave: () => void
  onDiscard: () => void
  saving: boolean
  justSaved: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-2.5">
      <select
        value={PAGES.some((entry) => entry.path === page) ? page : ''}
        onChange={(event) => onPage(event.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[13px] text-[#111827] outline-none focus:border-[#2447D6]"
      >
        {!PAGES.some((entry) => entry.path === page) ? <option value="">{page}</option> : null}
        {PAGES.map((entry) => (
          <option key={entry.path} value={entry.path}>
            {entry.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5">
        {DEVICES.map((entry) => {
          const Icon = DEVICE_ICONS[entry.id]
          const active = device === entry.id
          return (
            <button
              key={entry.id}
              onClick={() => onDevice(entry.id)}
              title={entry.label}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[12px] transition-colors ${
                active ? 'bg-[#eef2ff] text-[#2447D6]' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              <Icon size={14} strokeWidth={2} />
              <span className="hidden lg:inline">{entry.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5">
        <button
          onClick={() => onMode('edit')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] transition-colors ${
            mode === 'edit' ? 'bg-[#eef2ff] text-[#2447D6]' : 'text-[#9ca3af] hover:text-[#6b7280]'
          }`}
        >
          <MousePointerClick size={14} strokeWidth={2} /> עריכה
        </button>
        <button
          onClick={() => onMode('browse')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] transition-colors ${
            mode === 'browse' ? 'bg-[#eef2ff] text-[#2447D6]' : 'text-[#9ca3af] hover:text-[#6b7280]'
          }`}
        >
          <Hand size={14} strokeWidth={2} /> ניווט
        </button>
      </div>

      <div className="mr-auto flex flex-wrap items-center gap-2">
        {justSaved ? (
          <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
            <Check size={14} /> נשמר ופורסם
          </span>
        ) : null}

        <button
          onClick={onPanel}
          disabled={changeCount === 0}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] transition-colors disabled:opacity-40 ${
            panelOpen ? 'border-[#2447D6] text-[#2447D6]' : 'border-gray-200 text-[#6b7280]'
          }`}
        >
          <ListChecks size={14} /> שינויים ({changeCount})
        </button>

        <button
          onClick={onDiscard}
          disabled={changeCount === 0 || saving}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] text-[#6b7280] transition-colors hover:border-[#ef4444] hover:text-[#ef4444] disabled:opacity-40"
        >
          <RotateCcw size={13} /> ביטול
        </button>

        <a
          href={page}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] text-[#6b7280] transition-colors hover:border-[#2447D6] hover:text-[#2447D6]"
        >
          <ExternalLink size={13} /> פתיחה באתר
        </a>

        <button
          onClick={onSave}
          disabled={saving || changeCount === 0}
          style={{ background: changeCount > 0 && !saving ? gradient : '#d1d5db' }}
          className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[12px] font-semibold text-white disabled:cursor-not-allowed"
        >
          <Save size={14} />
          {saving ? 'שומר...' : 'שמירה ופרסום'}
        </button>
      </div>
    </div>
  )
}
