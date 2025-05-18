import { useEffect } from 'react';

function useKeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch('https://menatl-bot-service.onrender.com/auth/renew-token',{
          method: "GET",
          credentials: "include",
        })
        .then(res => {
          if (!res.ok) throw new Error('Ping failed');
          console.log('Keep-alive ping successful');
        })
        .catch(err => console.error('Keep-alive error:', err));
    };

    ping();
    const interval = setInterval(ping, 5 * 60 * 1000);

    return () => clearInterval(interval); 
  }, []);
}

export default useKeepAlive;
