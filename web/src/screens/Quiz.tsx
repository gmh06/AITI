import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { questions } from '../content'
import { OPTIONS } from '../content/types'
import type { OptionKey } from '../content/types'
import { REDUCED_MOTION_QUERY } from '../core/env'
import { QuizOutline } from './QuizOutline'
import { RichText, TopBar } from './shared'

const ANSWER_FEEDBACK_MS = 280

interface QuizProps {
  index: number
  saved?: OptionKey
  onAnswer: (index: number, key: OptionKey) => void
  onBack: () => void
}

export function Quiz({ index, saved, onAnswer, onBack }: QuizProps) {
  const question = questions[index]
  const heading = useRef<HTMLHeadingElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [pending, setPending] = useState<OptionKey>()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    heading.current?.focus({ preventScroll: true })
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function answer(key: OptionKey) {
    if (timer.current !== undefined) return
    setPending(key)
    const delay = matchMedia(REDUCED_MOTION_QUERY).matches ? 150 : ANSWER_FEEDBACK_MS
    timer.current = window.setTimeout(() => onAnswer(index, key), delay)
  }

  function back() {
    window.clearTimeout(timer.current)
    onBack()
  }

  return (
    <section className="screen quiz" aria-labelledby="question-title">
      <TopBar backLabel={index === 0 ? '回到首页' : '上一题'} onBack={back} />
      <div className="context">
        <span className="context-label" aria-hidden="true">context <b>{question.id}</b>/{questions.length}</span>
        <span className="sr-only" id="question-progress">第 {question.id} 题，共 {questions.length} 题</span>
        <div className="tokens" aria-hidden="true">
          {questions.map(({ id }) => (
            <span className={id === question.id ? 'current' : id < question.id ? 'done' : undefined} key={id} />
          ))}
        </div>
      </div>
      <div className="question">
        <div className="question-head">
          <div className="question-number" aria-hidden="true"><QuizOutline text={String(question.id).padStart(2, '0')} /></div>
          <h2 className="question-scene" id="question-title" aria-describedby="question-progress" tabIndex={-1} ref={heading}>
            <RichText text={question.scene} />
          </h2>
        </div>
        <div className="options" role="group" aria-labelledby="question-title">
          {OPTIONS.map((key) => (
            <button className="option" type="button" aria-pressed={(pending ?? saved) === key} key={key} onClick={() => answer(key)}>
              <span className="option-key" aria-hidden="true"><QuizOutline text={key} /></span>
              <span className="option-text"><span className="sr-only">{key}. </span><RichText text={question.options[key].text} /></span>
            </button>
          ))}
          <span className="options-center" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
