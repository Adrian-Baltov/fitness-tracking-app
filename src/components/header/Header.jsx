import styles from './Header.module.css'

const Header = () => {
    const { container } = styles

    return (
        <div className={container}>
            <div>Logo</div>
            <div>
                <div>icon</div>
                <div>name</div>
            </div>
        </div>
    )
}

export default Header