import { Routes, Route } from "react-router-dom"
import { Welcome } from "./pages/Welcome/Welcome.tsx"
import { Quiz } from "./pages/Quiz/Quiz.tsx"

export function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/quiz" element={<Quiz />} />
            </Routes>
        </div>
    )
}
