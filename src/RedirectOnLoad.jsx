import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectOnLoad () {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for F5 or Ctrl+R
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault(); // Prevent the default browser refresh
        navigate('/'); // Redirect to "/"
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return <></>;
};

