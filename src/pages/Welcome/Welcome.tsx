import { useNavigate } from "react-router-dom"
import styles from "./Welcome.module.scss"

export function Welcome() {
    const navigate = useNavigate()

    function clickHandler() {
        navigate("/quiz")
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Quizzical</h1>
            <h4 className={styles.congrats}>Welcome to our quiz</h4>
            <button onClick={clickHandler}>Click Here</button>
        </div>
    )
}
