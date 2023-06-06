import { useEffect, useState } from "react"

const API = "https://opentdb.com/api.php?amount=5&category=15&difficulty=easy&type=multiple"

interface IApiData {
    category: string
    type: string
    difficulty: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

interface IQuizData {
    id: number
    question: string
    correct_answer: string
    answers: string[]
    selectedAnswer?: string
    isChecked?: boolean
}

function shuffle(arr: string[]): string[] {
    return arr?.sort(() => Math.random() - 0.5)
}

function formatQuizData(data: IApiData[]): IQuizData[] {
    return data.map((item, index) => {
        const { question, correct_answer, incorrect_answers } = item
        const answers = shuffle([correct_answer, ...incorrect_answers])
        const formatted = { question, answers, correct_answer, id: index }
        return formatted
    })
}

export function App() {
    const [quizData, setQuizData] = useState<IQuizData[]>([])
    const [score, setScore] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function fetchQuizData() {
        setQuizData([])
        setLoading(true)
        try {
            const response = await fetch(API)
            const data = await response.json()
            const formattedData = formatQuizData(data.results)
            setQuizData(formattedData)
        } catch (e) {
            setError("Oops")
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchQuizData()
    }, [])

    function resetHandler() {
        fetchQuizData()
        setScore(null)
    }

    function answerClickHandler(questionId: number, selectedAnswer: string) {
        setQuizData(prev => {
            return prev.map(item => {
                if (item.id === questionId) {
                    return { ...item, selectedAnswer }
                }
                return item
            })
        })
    }

    function checkAnswersHandler() {
        if (!quizData.every(item => !!item.selectedAnswer)) {
            alert("You must answer all questions")
            return
        }

        setQuizData(prev => {
            return prev.map(item => ({ ...item, isChecked: true }))
        })

        setScore(countScore(quizData))
    }

    function countScore(data: IQuizData[]) {
        let score = 0

        data.forEach(item => {
            const isCorrect = item.correct_answer === item.selectedAnswer
            if (isCorrect) {
                score++
            }
        })

        return score
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="App">
            {quizData?.map(item => {
                const { id, question, answers, selectedAnswer, correct_answer, isChecked } = item

                return (
                    <div style={{ marginBottom: 10 }} key={id}>
                        <div>{question}</div>
                        <div>
                            {answers.map(answer => {
                                const isCorrect = answer === correct_answer
                                return (
                                    <div
                                        onClick={() => answerClickHandler(id, answer)}
                                        style={{
                                            border:
                                                selectedAnswer === answer
                                                    ? "1px solid magenta"
                                                    : "black",
                                            color:
                                                isChecked && isCorrect
                                                    ? "royalblue"
                                                    : isChecked &&
                                                      !isCorrect &&
                                                      answer === selectedAnswer
                                                    ? "red"
                                                    : "black",

                                            pointerEvents: isChecked ? "none" : "auto",
                                        }}
                                    >
                                        {answer}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            {score === null ? (
                <button onClick={checkAnswersHandler}>Check Answers</button>
            ) : (
                <>
                    <button onClick={resetHandler}>Try Again</button>
                    <div>{score}</div>
                </>
            )}
        </div>
    )
}
