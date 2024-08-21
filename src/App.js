import React, { useEffect, useState } from 'react';
import './App.css';

const apekey = 'NjZjNjQzYzVjYmY2ZTNjNjBmZWY3YTcyLk5SX3BEQWtPdDc4ZUhEQ2pMbktfR2RJTlI4dGppOFN3';

const fetchUserStats = async () => {
    const response = await fetch("https://api.monkeytype.com/users/stats", {
        method: "GET",
        headers: {
            Authorization: `ApeKey ${apekey}`,
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const fetchPersonalBests = async () => {
    const response = await fetch("https://api.monkeytype.com/users/personalBests?mode=time", {
        method: "GET",
        headers: {
            Authorization: `ApeKey ${apekey}`,
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const App = () => {
    const [stats, setStats] = useState(null);
    const [bests, setBests] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userStats = await fetchUserStats();
                setStats(userStats.data);
                const personalBests = await fetchPersonalBests();
                setBests(personalBests.data);
            } catch (error) {
                setError(error.message);
            }
        };
        loadData();
    }, []);

    if (error) {
        return <div className="container">Error: {error}</div>;
    }

    return (
        <div className="container">
            <header>
                <h1>🐒MonkeyType User Stats🐒</h1>
            </header>
            <section>
                <div className="card">
                    <div className="card__title">User Stats</div>
                    <div className="card__content">
                        {stats ? (
                            <ul>
                                <p>Completed Tests: {stats.completedTests}</p>
                                <p>Started Tests: {stats.startedTests}</p>
                                <p>Time Typing: {(stats.timeTyping / 60).toFixed(2)} minutes</p>
                            </ul>
                        ) : (
                            <p>Loading user stats...</p>
                        )}
                    </div>
                </div>
            </section>
            <section>
                <h2>Personal Bests</h2>
                {bests ? (
                    Object.entries(bests).map(([time, entries]) => (
                        <div key={time} className="card">
                            <div className="card__title">{time} Seconds</div>
                            <div className="card__description">
                                {entries.map((entry, index) => (
                                    <div key={index} className="card__content">
                                        <p><strong>WPM:</strong> {entry.wpm}</p>
                                        <p><strong>Accuracy:</strong> {entry.acc}%</p>
                                        <p><strong>Consistency:</strong> {entry.consistency}%</p>
                                        <p><strong>Difficulty:</strong> {entry.difficulty}</p>
                                        <p><strong>Raw Speed:</strong> {entry.raw} WPM</p>
                                        <p><strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading personal bests...</p>
                )}
            </section>
            <footer>
                <p>04:58am!🤷‍♂️</p>
            </footer>
        </div>
    );
};

export default App;
