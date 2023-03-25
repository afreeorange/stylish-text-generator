import { render } from 'preact'
import App from './app'

render(<App />, document.querySelector('main') as HTMLElement)
