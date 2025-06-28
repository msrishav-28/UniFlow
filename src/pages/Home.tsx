import React, { useEffect } from 'react';
import VerticalFeed from '../components/Feed/VerticalFeed';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  const { events, cleanupOldEvents } = useStore();

  useEffect(() => {
    cleanupOldEvents();
  }, [cleanupOldEvents]);

  return <VerticalFeed events={events} />;
};

export default Home;