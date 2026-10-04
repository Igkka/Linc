import Image from "next/image";
import styles from "./page.module.css"
import HomePage from "@/components/Home";
import Header from "@/components/Header";
import PricesPage from "@/components/Price";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>
      <HomePage/>
      <PricesPage/>
      <Footer/>
    </div>
  );
}
