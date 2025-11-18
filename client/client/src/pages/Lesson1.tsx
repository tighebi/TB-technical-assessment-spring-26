import { Link } from 'react-router-dom';

export default function Lesson1() {
  return (
    <div>
      <h1>Lesson 1: The Physics of an Ollie</h1>
      <p>This is your deep dive page!</p>
      
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}

