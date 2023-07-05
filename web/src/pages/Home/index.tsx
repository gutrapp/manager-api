import { Layout } from "../../components/Layout";
import { Link } from "react-router-dom";
import "./index.css";

export const Home = () => {
  return (
    <Layout>
      <div className="home">
        <h1 className="home__title">Manage your projects.</h1>
        <text className="home__text">
          Esse projeto te ajuda a gerenciar seus projetos de forma organizada,
          deixando possível você acompanhar exatamente oque esta acontecendo.
        </text>
        <Link to={"/login"}>
          <button className="home__start">Get Started</button>
        </Link>
      </div>
    </Layout>
  );
};
