import { classNames } from "../../../../classNames"
import { IFormatedQuizData } from "../../Quiz"
import styles from "./QuizQuestions.module.scss"

interface QuizQuestionsProps {
    data: IFormatedQuizData[]
    selectedHandler: (id: number, selected: string) => void
}

export function QuizQuestions({ data, selectedHandler }: QuizQuestionsProps) {
    return (
        <div className={styles.wrapper}>
            {data.map(item => {
                const { formatedQuestion, answers, correctAnswer, id, selectedAnswer, isChecked } =
                    item
                return (
                    <div key={id} className={styles.container}>
                        <h2>{formatedQuestion}</h2>
                        <div className={styles.answersContainer}>
                            {answers?.map((answer, index) => {
                                const isSelected = selectedAnswer === answer
                                const isCorrect = selectedAnswer === correctAnswer
                                return (
                                    <div
                                        key={index}
                                        className={classNames(styles.answer, {
                                            [styles.selected]: isSelected,
                                            [styles.correct]:
                                                (isCorrect && isChecked && isSelected) ||
                                                (correctAnswer === answer && isChecked),
                                            [styles.wrong]: !isCorrect && isChecked && isSelected,
                                            [styles.checked]: isChecked && !isSelected,
                                        })}
                                        onClick={() => selectedHandler(id, answer)}
                                    >
                                        <p className={styles.ans}>{answer}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
