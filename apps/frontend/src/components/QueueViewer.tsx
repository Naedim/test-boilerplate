// import { useEffect, useState } from 'react';
import { useEffect } from 'react';

export const QueueViewer = ()=>{
    // const [events, setEvents] = useState([]);

    // const HOST = process.env.HOST
    // const PORT = process.env.PORT
    useEffect(() => {
    //   const eventSource = new EventSource(`http://${HOST}:${PORT}/`);
    //   const eventSource = new EventSource(`http://localhost:3000/event`);
  
    const sse = new EventSource('http://localhost:3000/event')
    sse.onmessage = e => {
       console.log("e : ", e) 
    }
    sse.onerror = () => {
      // error log here 
      
      sse.close();
    }
    return () => {
      sse.close();
    };
    }, []);
    return(

    <p className = "text-red-500">coucou</p>
    )
}