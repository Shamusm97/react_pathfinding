import styles from './page.module.css'
import BoxRenderer from './BoxRenderer'
import {GraphProvider} from './GraphHandler'


export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.title}>Hello World!</p>
      </header>
      <GraphProvider>
        <BoxRenderer />
      </GraphProvider>
    </main>
  )
}
