import { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useFlow } from './core/useFlow'
import { Intro } from './screens/Intro'
import { Quiz } from './screens/Quiz'
import { Result } from './screens/Result'
import { Scene } from './screens/Scene'
import './styles/site.css'

function App() {
  const { flow, send } = useFlow()
  const started = useRef(false)
  const intro = flow.screen === 'intro'

  function start() {
    started.current = true
    send({ type: 'START' })
  }

  return (
    <div className={intro ? 'app app-intro' : 'app'}>
      <Scene intro={intro} />
      <main>
        {flow.screen === 'intro' && <Intro onStart={start} restoreFocus={started.current} />}
        {flow.screen === 'quiz' && (
          <Quiz
            key={flow.index}
            index={flow.index}
            saved={flow.answers[flow.index]}
            onAnswer={(index, key) => send({ type: 'ANSWER', index, key })}
            onBack={() => send({ type: 'BACK' })}
          />
        )}
        {(flow.screen === 'reveal' || flow.screen === 'result') && (
          <Result
            result={flow.result}
            revealing={flow.screen === 'reveal'}
            onRevealed={() => send({ type: 'REVEAL_DONE' })}
            onBack={() => send({ type: 'BACK' })}
            onRestart={() => send({ type: 'RESTART' })}
          />
        )}
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
