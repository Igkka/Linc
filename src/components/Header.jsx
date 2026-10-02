
import "@/components/Header.css"

export default function Header(){
    return(
        <header>
            <div className="logo">
                <img className="logoheader" src="./logo.png" alt="" />
                <a href="/">Linc</a>
            </div>
            <div className="linkssite">
                <a href="#support">Support</a>
                <a href="#prices">Prices</a>
                <a href="/reg">Registration</a>
                <a href="/login">Log In</a>
            </div>
        </header>
    )
}