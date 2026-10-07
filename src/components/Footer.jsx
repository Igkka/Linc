
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">

                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src="/logo.png" alt="Linc" />
                        <span>Linxy</span>
                    </div>

                    <p>
                        Your profile. Your style. Your choice.
                    </p>
                </div>

                <div className="footer-links">

                    <div className="footer-column">
                        <h4>Product</h4>

                        <a href="#prices">Prices</a>
                        <a href="/reg">Registration</a>
                        <a href="/login">Log In</a>
                    </div>

                    <div className="footer-column">
                        <h4>Support</h4>

                        <a href="#support">Support</a>
                        <a href="#faq">FAQ</a>
                    </div>

                    <div className="footer-column">
                        <h4>Social</h4>

                        <a
                            href="https://github.com/Igkka"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://t.me/gykkozz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Telegram
                        </a>
                    </div>

                </div>

            </div>

            <div className="footer-bottom">
                <span>© 2026 Linxy. All rights reserved.</span>

                <div>
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Terms</a>
                </div>
            </div>

        </footer>
    );
}
