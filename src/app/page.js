import Image from "next/image";
import styles from "./page.module.css"
import HomePage from "@/components/Home";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>
      <HomePage/>
    </div>
  );
}
