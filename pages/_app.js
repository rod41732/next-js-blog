import '../styles/global.css'; // styles for markdown
import '../styles/hljs-vs2015.css'; // code highlighting
import { ThemeProvider } from 'theme-ui';
import theme from '../theme';

export default function App({ Component, pageProps }) {
  return <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
}