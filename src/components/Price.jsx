
import "@/components/Price.css"

const plans = [
    {
        title: "Free",
        price: "$0",
        features: [
            "Linc Personal Page",
            "Unique Username",
            "Avatar & Description",
            "Social Media Links",
            "Basic Profile Customization",
            "Custom Background",
            "1 Music Track",
            "Basic Music Player",
            "Discord Profile",
            "Basic Support"
        ]
    },
    {
        title: "Pro",
        price: "$5 / month",
        features: [
            "Everything in Free",
            "Full Profile Customization",
            "Unlimited Music",
            "Custom Background & Animations",
            "Custom Fonts",
            "Text Size & Color Control",
            "Advanced Music Player",
            "Discord Rich Presence",
            "Unlimited Social Links",
            "Remove Linc Branding",
            "Profile Analytics",
            "Priority Support"
        ]
    }
];

export default function PricesPage(){
    return(
        <>
        <div  id="prices">

        </div>

        <section className="pricespage">
            <div className="pricescontent">
                <h1>Your profile. Your style. Your choice.</h1>
                <p className="pricesdesc">Choose the plan that fits your needs and unlock the tools you need to create a unique Linc profile. Start simple or get more freedom to customize every part of your page.</p>
            </div>
            <div className="cardplans">
                {plans.map((plan)=>(
                     <div className="card" key={plan.title}>
                        <h3>{plan.title}</h3>
                        <p>{plan.price}</p>
                        <ul>
                            {plan.features.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <button>
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </section>
                </>
    )
}