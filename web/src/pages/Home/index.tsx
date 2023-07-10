import { Layout } from "../../components/Layout";
import { Link } from "react-router-dom";
import "./index.css";
import { PROJECT_EXAMPLES } from "../../utils/projects";
import { AiFillFolderAdd } from "react-icons/ai";
import { HiOutlineFilter } from "react-icons/hi";

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

        <div className="dashboard-div">
          <h1 className="dashboard">Dashboard</h1>
          <div className="dashboard-icons">
            <div className="dashboard-icon">
              <AiFillFolderAdd size={30} />
            </div>
            <div className="dashboard-icon">
              <HiOutlineFilter size={30} />
            </div>
          </div>
          <div className="dashboard-example">
            {PROJECT_EXAMPLES.map((project, i) => {
              return (
                <div className="project" key={i}>
                  <label className="project__text">{project.name}</label>
                  <label className="project__text">
                    Devs: {project.developers}
                  </label>
                  <label className="project__text">
                    Tasks: {project.tasks}
                  </label>
                  <label className="project__text">Bugs: {project.bugs}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};
