import { useState, useEffect } from 'react';

function CountdownView({ onFinish }) {
    const [count, setCount] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    return "";
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (count === "") {
            onFinish();
        }
    }, [count, onFinish]);

    return (
        <div id="countdown-view" className="card main-card">
            <div id="countdown-number">
                {count}
            </div>
        </div>
    );
}

export default CountdownView;
