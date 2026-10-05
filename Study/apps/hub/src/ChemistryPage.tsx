import { useEffect } from 'react';
import { App } from '@study/chemistry-web/app';
import '@study/chemistry-web/styles.css';

export default function ChemistryPage() {
  useEffect(() => {
    document.title = 'Chemistry Path · 化学学习路径';
  }, []);
  return <App />;
}
