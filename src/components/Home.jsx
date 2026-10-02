
import "@/components/Home.css"

export default function HomePage(){
    return(
        <section className="homepage">
                <video
                    className="home-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    
                >
                    <source src="/back.mp4" type="video/mp4" />
                </video>
            <div className="homecontent">
                <h1>Linc - more than a profile.</h1>
                <p className="homedesc">Create your own digital space, shape every detail, share what you love, and let people discover the person behind the profile</p>
                <div className="homebtns">
                    <button className="homebtn">Join Now</button>
                    <button className="homebtn">View prices</button>
                    
                </div>
            </div>
        </section>
    )
}