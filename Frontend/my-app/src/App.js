import React, { useEffect, useState } from 'react';

function App() {
    const [issPosition, setIssPosition] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/iss-position')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setIssPosition(data);
            })
            .catch((error) => console.error('Error fetching ISS position:', error));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>ISS Tracker</h1>
                {issPosition ? (
                    <div>
                        <p>Latitude: {issPosition.latitude}</p>
                        <p>Longitude: {issPosition.longitude}</p>
                        <p>Timestamp: {new Date(issPosition.timestamp).toLocaleString()}</p>
                    </div>
                ) : (
                    <p>Loading ISS position...</p>
                )}
            </header>
        </div>
    );
}

export default App;