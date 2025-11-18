import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../api';

export default function Home() {
  useEffect(() => {
    // Test Axios connection
    api.get('/api/test')
       .then(response => console.log(response.data))
       .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Welcome to learning to be cool</h1>
      <p>Learn a party trick!</p>
      
      {/* This button instantly swaps the component without reloading */}
      <Link to="/lesson-1">
        <button>Start Learning</button>
      </Link>
    </div>
  );
}

