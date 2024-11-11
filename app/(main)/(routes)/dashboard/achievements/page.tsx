"use client";
import React, { useEffect, useState } from 'react';

const Achievements = () => {
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    // Fetch the loginStreak from the backend
    async function fetchStreak() {
      const response = await fetch('/api/getLoginStreak'); // Replace with the actual API endpoint
      const data = await response.json();
      setLoginStreak(data.loginStreak);
    }

    fetchStreak();
  }, []);

  const getAchievementLevel = () => {
    if (loginStreak >= 10) return 'Gold';
    if (loginStreak >= 5) return 'Silver';
    if (loginStreak >= 3) return 'Bronze';
    return 'No Achievements Yet';
  };

  return (
    <div>
      <h3>Achievements</h3>
      <p>Login Streak: {loginStreak}</p>
      <p>Achievement Level: {getAchievementLevel()}</p>
    </div>
  );
};

export default Achievements;
