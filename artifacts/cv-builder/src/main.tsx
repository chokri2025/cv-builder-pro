import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import { initAnalytics } from './lib/analytics';

initAnalytics();

createRoot(document.getElementById('root')!).render(<App />);
