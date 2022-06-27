import './App.css';
import { ProtectedRoutes } from './Components/Routes';

function App() {
  return (
    <div className='min-h-screen h-auto min-w-screen w-full bg-gray-100 p-10'>
      <ProtectedRoutes />
    </div>
  );
}

export default App;
