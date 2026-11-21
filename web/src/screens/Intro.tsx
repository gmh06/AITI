import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { loadParticipationTotal } from '../core/participation'
import eventDepartment from '../../assets/style/event-department.svg'
import eventFestival from '../../assets/style/event-festival.svg'
import festivalLogo from '../../assets/style/logo-white.png'

export function Intro({ onStart, restoreFocus }: { onStart: () => void; restoreFocus: boolean }) {
  const start = useRef<HTMLButtonElement>(null)
  const [participation, setParticipation] = useState<number>()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (restoreFocus) start.current?.focus({ preventScroll: true })
  }, [restoreFocus])
  useEffect(() => {
    let active = true
    void loadParticipationTotal().then((total) => {
      if (active) setParticipation(total)
    })
    return () => { active = false }
  }, [])

  return (
    <section className="screen intro" aria-labelledby="intro-title">
      <svg className="intro-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <path id="intro-a" fillRule="evenodd" d="M0 100V22L22 0H70L92 22V100H70V64H22V100ZM22 44H70V28L64 22H28L22 28Z" />
          <path id="intro-i" d="M4 0H22V96L18 100H0V4Z" />
          <path id="intro-t" d="M0 0H78L84 6V22H53V100H31V22H6L0 16Z" />
          <polygon id="intro-octagon" points="18,4 46,4 60,18 60,46 46,60 18,60 4,46 4,18" />
          <linearGradient id="intro-title-left">
            <stop offset="0" stopColor="#A3B2F2" /><stop offset=".7" stopColor="#E5ECFF" /><stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id="intro-title-right">
            <stop offset="0" stopColor="#FFFFFF" /><stop offset=".3" stopColor="#E5ECFF" /><stop offset="1" stopColor="#A3B2F2" />
          </linearGradient>
          <linearGradient id="intro-button" x2="1" y2="1">
            <stop offset="0" stopColor="#1C2E6B" /><stop offset=".55" stopColor="#3C4FA8" /><stop offset="1" stopColor="#5E79D6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="intro-beam" aria-hidden="true" />
      <h1 id="intro-title" className="sr-only">AITI</h1>
      <img className="festival-logo" src={festivalLogo} alt="Beyond Context" width="1100" height="390" fetchPriority="high" />
      <div className="intro-event">
        <img className="event-department" src={eventDepartment} alt="计算机科学与技术系" width="7665" height="1096" />
        <img className="event-festival" src={eventFestival} alt="第 44 届学生节" width="7665" height="1096" />
      </div>
      <div className="intro-title" aria-hidden="true">
        <svg className="intro-title-left" viewBox="0 0 128 100">
          <g fill="url(#intro-title-left)"><use href="#intro-a" /><use href="#intro-i" x="106" /></g>
        </svg>
        <svg className="intro-title-right" viewBox="0 0 120 100">
          <g fill="url(#intro-title-right)"><use href="#intro-t" /><use href="#intro-i" x="98" /></g>
        </svg>
      </div>
      <div className="intro-start">
        <button className="dive" type="button" aria-label="开始测试" onClick={onStart} ref={start}>
          <svg className="dive-pulse" viewBox="0 0 64 64" aria-hidden="true"><use href="#intro-octagon" /></svg>
          <svg className="dive-pulse dive-pulse-late" viewBox="0 0 64 64" aria-hidden="true"><use href="#intro-octagon" /></svg>
          <svg className="dive-core" viewBox="0 0 64 64" aria-hidden="true">
            <use href="#intro-octagon" />
            <path d="M26 21L44 32L26 43Z" fill="#fff" />
          </svg>
        </button>
        {participation !== undefined && <p className="participation-total">累计 {participation} 次参与</p>}
      </div>
    </section>
  )
}
