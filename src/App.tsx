import React from "react";
import "./app.css";

export function App() {
    return (
        <div className="app bg-gray-800 text-gray-200 items-center">
            <canvas id="3dview" className="w-full h-full"></canvas>
        </div>
    );
}

export default App;
