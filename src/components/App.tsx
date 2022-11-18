import { CSSProperties } from 'react'
import styles from './app.module.scss'
import '@/assets/styles/normalize.scss'

const App = () => {
  const keyWords = ['webpack', 'react', 'typescript', 'babel', 'eslint', 'prettier', 'sass', 'postcss']

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Start your project</h1>
      <div className={styles['loader-wrapper']}>
        <div className={styles.loader}>
          {keyWords.map((word, i) => (
            <span
              key={i}
              style={{ '--i': keyWords.length - i } as CSSProperties}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
