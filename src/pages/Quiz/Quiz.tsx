import { decode } from "html-entities"
import { useEffect, useState } from "react"
import { QuizQuestions } from "./components/QuizQuestions/QuizQuestions"
import { QuizAnswers } from "./components/QuizAnswers/QuizAnswers"
import styles from "./Quiz.module.scss"

interface IQuizData {
    category: string
    type: string
    difficulty: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

export interface IFormatedQuizData {
    formatedQuestion: string
    correctAnswer: string
    answers: string[]
    selectedAnswer?: string
    isChecked?: boolean
    id: number
}

function getFormatedData(data: IQuizData[]): IFormatedQuizData[] {
    return data.map((props, index) => {
        const { question, correct_answer, incorrect_answers } = props
        const formatedQuestion = decode(question, { level: "all" })
        const correctAnswer = decode(correct_answer, { level: "all" })
        const otherAnswers = incorrect_answers.map(answer => {
            return decode(answer, { level: "all" })
        })
        const answers = [...otherAnswers, correctAnswer].sort(() => Math.random() - 0.5)
        const newData = { formatedQuestion, correctAnswer, answers, id: index }
        return newData
    })
}

export function Quiz() {
    const [quizData, setQuizData] = useState<IFormatedQuizData[]>([])
    const [score, setScore] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    async function FetchQuiz() {
        setQuizData([])
        setIsLoading(true)
        try {
            const response = await fetch(
                "https://opentdb.com/api.php?amount=5&category=15&difficulty=easy&type=multiple"
            )
            const data = await response.json()
            const formatedData = getFormatedData(data.results)
            setQuizData(formatedData)
        } catch (e) {
            setIsError(true)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        FetchQuiz()
    }, [])

    function selectedAnswerHandler(questionId: number, selectedAnswer: string) {
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
            alert("ansewr all questions")
            return
        }

        setQuizData(prev => {
            return prev.map(item => {
                return { ...item, isChecked: true }
            })
        })

        setScore(scoreCounter(quizData))
    }

    function scoreCounter(data: IFormatedQuizData[]) {
        let score = 0
        data.forEach(item => {
            if (item.selectedAnswer === item.correctAnswer) {
                score++
            }
        })
        return score
    }

    function resetHandler() {
        FetchQuiz()
        setScore(null)
    }

    if (isLoading) return <div>Loading... don't worry, the game is worth the wait!</div>
    if (isError) return <div>Oops... looks like the boss battle glitched out!</div>

    return (
        <div className={styles.wrapper}>
            <QuizQuestions data={quizData} selectedHandler={selectedAnswerHandler} />

            {score === null ? (
                <button onClick={checkAnswersHandler}>Check answers</button>
            ) : (
                <>
                    <div>{`${score} / ${quizData.length}`}</div>
                    <button onClick={resetHandler}>Try again</button>
                </>
            )}
        </div>
    )
}
