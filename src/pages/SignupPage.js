import React from 'react';
import Register from '../components/Auth/Register';
import { useSelector } from 'react-redux';

const SignupPage = () => {
  const { darkMode } = useSelector(state => state.ui);
  
  React.useEffect(() => {
    // Apply dark mode to html
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Register />
    </div>
  );
};

export default SignupPage;