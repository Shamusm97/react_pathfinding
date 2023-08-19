import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import styles from './page.module.css'
import { APIProvider } from './APIHandler';
import UIRenderer from './UIRenderer';

export default function Home() {
  return (
    <main className={styles.main}>
      <APIProvider />
    </main>
  )
}
