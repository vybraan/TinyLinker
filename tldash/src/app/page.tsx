// import { GetServerSideProps } from "next";
import Header from "../components/Header.tsx"
import Footer from "../components/Footer.tsx"
import Dashboard from "../components/Dashboard.tsx"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <Dashboard/>
      <Footer />
    </div>
  );
}

