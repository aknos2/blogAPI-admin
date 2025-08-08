import { useOutletContext } from 'react-router-dom';
import MainContent from './components/Main/MainContent';

function App() {
  // Get the context from Layout
  const context = useOutletContext();
  
  // Pass context to MainContent if it still needs it
  return <MainContent />;
}

export default App;