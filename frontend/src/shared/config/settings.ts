export interface Settings {
  pomodoroDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  cycleLength: number
}

export const DEFAULT_SETTINGS: Settings = {
  pomodoroDuration: 30,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cycleLength: 4,
}
