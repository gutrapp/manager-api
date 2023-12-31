import {
  AiFillFolderAdd,
  AiOutlineFileAdd,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BsCircle } from "react-icons/bs";
import { BiAddToQueue } from "react-icons/bi";
import { HiOutlineFilter, HiOutlinePencil } from "react-icons/hi";
import { Layout } from "../../components/Layout";
import { useState } from "react";
import "./index.css";
import { Project } from "../../types/project";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Bug } from "../../types/bug";
import { Task } from "../../types/task";
import { Filter } from "../../types/filter";
import {
  CreateBugModal,
  CreateProjectModal,
  CreateTaskModal,
  UpdateBugModal,
  UpdateProjectModal,
  UpdateTaskModal,
} from "../../components/Modals";

export const Dashboard = () => {
  const router = useNavigate();

  const [userId, setUserId] = useState<number>(0);

  const [objectId, setObjectId] = useState<number>(0);

  const [filterData, setFilterData] = useState<Filter>({
    complete: false,
    description: "",
    name: "",
    solved: false,
    title: "",
  });

  const [updateProjectModal, setUpdateProjectModal] = useState<boolean>(false);

  const [updateTaskModal, setUpdateTaskModal] = useState<boolean>(false);

  const [updateBugModal, setUpdateBugModal] = useState<boolean>(false);

  const [projectAddModal, setProjectAddModal] = useState<boolean>(false);

  const [taskAddModal, setTaskAddModal] = useState<boolean>(false);

  const [bugAddModal, setBugAddModal] = useState<boolean>(false);

  const [projectFilterModal, setProjectFilterModal] = useState<boolean>(false);

  const [taskFilterModal, setTaskFilterModal] = useState<boolean>(false);

  const [bugFilterModal, setBugFilterModal] = useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>([]);

  const [bugs, setBugs] = useState<Bug[]>([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const CheckAuth = useQuery({
    queryKey: ["auth"],
    queryFn: async () =>
      await axios
        .get("http://127.0.0.1:8000/api/auth/authenticated", {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
          withCredentials: true,
        })
        .then((response) => {
          if (!response.data.auth) {
            router("/login");
          }
          setUserId(response.data.id);
        }),
  });

  const GetUserInfo = useQuery({
    queryKey: ["projects"],
    queryFn: async () =>
      await axios
        .get("http://127.0.0.1:8000/api/developer/info", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setProjects(response.data.projects);
          setBugs(response.data.bugs);
          setTasks(response.data.tasks);
        }),
  });

  const FilterProjects = async () => {
    const name = filterData.name ? filterData.name : "%(PASS)%";
    const description = filterData.description
      ? filterData.description
      : "%(PASS)%";

    await axios
      .get(
        `http://127.0.0.1:8000/api/developer/filter/tasks/${name}/${description}`
      )
      .then((response) => {
        setProjects(response.data);
      });
  };

  const FilterBugs = async () => {
    const title = filterData.title ? filterData.title : "%(PASS)%";
    const description = filterData.description
      ? filterData.description
      : "%(PASS)%";

    await axios
      .get(
        `http://127.0.0.1:8000/api/developer/filter/tasks/${title}/${description}`
      )
      .then((response) => {
        const bugs: Bug[] = response.data;
        let filteredBugs: Bug[] = [];

        bugs.map((bug, _) => {
          if (bug.solved === filterData.solved) filteredBugs.push(bug);
        });

        setBugs(filteredBugs);
      });
  };

  const FilterTasks = async () => {
    const title = filterData.title ? filterData.title : "%(PASS)%";
    const description = filterData.description
      ? filterData.description
      : "%(PASS)%";

    await axios
      .get(
        `http://127.0.0.1:8000/api/developer/filter/tasks/${title}/${description}`
      )
      .then((response) => {
        const tasks: Task[] = response.data;
        let filteredTasks: Task[] = [];

        tasks.map((task, _) => {
          if (task.complete === filterData.complete) filteredTasks.push(task);
        });

        setTasks(filteredTasks);
      });
  };

  const DeleteProject = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async (id: number) =>
      await axios.delete(`http://127.0.0.1:8000/api/project/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }),
    onSuccess: () => {
      window.location.reload();
    },
  });

  const DeleteTask = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: async (id: number) =>
      await axios.delete(`http://127.0.0.1:8000/api/task/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }),
    onSuccess: () => {
      window.location.reload();
    },
  });

  const DeleteBug = useMutation({
    mutationKey: ["delete-bug"],
    mutationFn: async (id: number) =>
      await axios.delete(`http://127.0.0.1:8000/api/bug/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }),
    onSuccess: () => {
      window.location.reload();
    },
  });

  const UpdateTask = useMutation({
    mutationKey: ["update-task"],
    mutationFn: async (id: number) =>
      await axios.put(
        `http://127.0.0.1:8000/api/task/${id}`,
        {
          title: tasks[id].title,
          description: tasks[id].description,
          complete: tasks[id].complete,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      ),
  });

  const UpdateBug = useMutation({
    mutationKey: ["update-bug"],
    mutationFn: async (id: number) =>
      await axios.put(
        `http://127.0.0.1:8000/api/bug/${id}`,
        {
          description: bugs[id].description,
          solved: bugs[id].solved,
          title: bugs[id].title,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      ),
  });

  return (
    <Layout>
      <div className="page">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="title__p">
            Here you can manage all your projects, tasks and bugs
          </p>
          <div className="dashboard-div">
            <h1 className="dashboard">Projects</h1>
            <div className="dashboard-icons">
              <div className="dashboard-icon">
                <button
                  className="button__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setProjectAddModal(!projectAddModal);
                  }}
                >
                  <AiFillFolderAdd size={30} />
                </button>
              </div>
              <div className="dashboard-icon">
                <button
                  className="button__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setProjectFilterModal(!projectFilterModal);
                  }}
                >
                  <HiOutlineFilter size={30} />
                </button>
              </div>
            </div>
            <div className="dashboard-example">
              {projects.map((project, i) => {
                return (
                  <div className="project" key={i}>
                    <label className="task__text">Project: {project.id}</label>
                    <label className="project__text">{project.name}</label>
                    <label className="project__text">
                      {project.developers.length} Developers
                    </label>
                    <button
                      className="button__icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setObjectId(project.id);
                        setUpdateProjectModal(!updateProjectModal);
                      }}
                    >
                      <HiOutlinePencil size={30} />
                    </button>
                    <button
                      className="button__icon"
                      onClick={(e) => {
                        e.preventDefault();
                        DeleteProject.mutate(project.id);
                      }}
                    >
                      <AiOutlineDelete size={30} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dashboard-div">
            <h1 className="dashboard">Tasks</h1>
            <div className="dashboard-icons">
              <div className="dashboard-icon">
                <button
                  className="button__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setTaskAddModal(!taskAddModal);
                  }}
                >
                  <AiOutlineFileAdd size={30} />
                </button>
              </div>
              <div className="dashboard-icon">
                <button
                  className="button__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setTaskFilterModal(!taskFilterModal);
                  }}
                >
                  <HiOutlineFilter size={30} />
                </button>
              </div>
            </div>
            <div className="dashboard-example">
              {tasks.map((task, i) => {
                return (
                  <div className="task" key={i}>
                    <div className="task-first">
                      {task.complete && (
                        <button
                          className="button__icon"
                          onClick={(e) => {
                            e.preventDefault();
                            let arr = [...tasks];
                            arr[i].complete = !arr[i].complete;
                            UpdateTask.mutate(task.id);
                            setTasks(arr);
                          }}
                        >
                          <AiOutlineCheckCircle size={30} />
                        </button>
                      )}
                      {!task.complete && (
                        <button
                          className="button__icon"
                          onClick={(e) => {
                            e.preventDefault();
                            let arr = [...tasks];
                            arr[i].complete = !arr[i].complete;
                            UpdateTask.mutate(task.id);
                            setTasks(arr);
                          }}
                        >
                          <BsCircle size={30} />
                        </button>
                      )}
                      <label className="task__text">Task: {task.id}</label>
                    </div>
                    <label className="task__text">{task.title}</label>
                    <button
                      className="button__icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setObjectId(task.id);
                        setUpdateTaskModal(!updateTaskModal);
                      }}
                    >
                      <HiOutlinePencil size={30} />
                    </button>
                    <button
                      className="button__icon"
                      onClick={(e) => {
                        e.preventDefault();
                        DeleteTask.mutate(task.id);
                      }}
                    >
                      <AiOutlineDelete size={30} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dashboard-div">
            <h1 className="dashboard">Bugs</h1>
            <div className="dashboard-icons">
              <div className="dashboard-icon">
                <button
                  className="button__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setBugAddModal(!bugAddModal);
                  }}
                >
                  <BiAddToQueue size={30} />
                </button>
              </div>
              <div className="dashboard-icon">
                <button
                  className="button__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setBugFilterModal(!bugFilterModal);
                  }}
                >
                  <HiOutlineFilter size={30} />
                </button>
              </div>
            </div>
            <div className="dashboard-example">
              {bugs.map((bug, i) => {
                return (
                  <div className="bug" key={i}>
                    <div className="bug-first">
                      {bug.solved && (
                        <button
                          className="button__icon"
                          onClick={(e) => {
                            e.preventDefault();
                            let arr = [...bugs];
                            arr[i].solved = !arr[i].solved;
                            UpdateBug.mutate(bug.id);
                            setBugs(arr);
                          }}
                        >
                          <AiOutlineCheckCircle size={30} />
                        </button>
                      )}
                      {!bug.solved && (
                        <button
                          className="button__icon"
                          onClick={(e) => {
                            e.preventDefault();
                            let arr = [...bugs];
                            arr[i].solved = !arr[i].solved;
                            UpdateBug.mutate(bug.id);
                            setBugs(arr);
                          }}
                        >
                          <BsCircle size={30} />
                        </button>
                      )}
                      <label className="bug__text">Issue: {bug.id}</label>
                    </div>
                    <label className="bug__text">{bug.title}</label>
                    <button
                      className="button__icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setObjectId(bug.id);
                        setUpdateBugModal(!updateBugModal);
                      }}
                    >
                      <HiOutlinePencil size={30} />
                    </button>
                    <button
                      className="button__icon"
                      onClick={(e) => {
                        e.preventDefault();
                        DeleteBug.mutate(bug.id);
                      }}
                    >
                      <AiOutlineDelete size={30} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <CreateBugModal
          display={bugAddModal}
          onClose={() => setBugAddModal(!bugAddModal)}
          id={userId}
        />
        <CreateProjectModal
          display={projectAddModal}
          onClose={() => setProjectAddModal(!projectAddModal)}
          id={userId}
        />
        <CreateTaskModal
          display={taskAddModal}
          onClose={() => setTaskAddModal(!taskAddModal)}
          id={userId}
        />

        <UpdateBugModal
          display={bugAddModal}
          onClose={() => setUpdateBugModal(!updateBugModal)}
          specific_id={objectId}
          id={userId}
        />
        <UpdateProjectModal
          display={projectAddModal}
          onClose={() => setUpdateProjectModal(!updateProjectModal)}
          specific_id={objectId}
          id={userId}
        />
        <UpdateTaskModal
          display={taskAddModal}
          onClose={() => setUpdateTaskModal(!updateTaskModal)}
          specific_id={objectId}
          id={userId}
        />

        {bugFilterModal ? (
          <main className="modal-component">
            <div className="modal">
              <button
                className="button__icon"
                onClick={() => setBugFilterModal(!bugFilterModal)}
              >
                <AiOutlineCloseCircle size={20} />
              </button>
              <form className="filter">
                <div className="filter__status">
                  {filterData.solved && (
                    <div
                      className="filter__solved"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterData({
                          ...filterData,
                          solved: !filterData.solved,
                        });
                      }}
                    >
                      <AiOutlineCheckCircle size={25} />
                      <button className="button__icon">Solved</button>
                    </div>
                  )}
                  {!filterData.solved && (
                    <div
                      className="filter__solved"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterData({
                          ...filterData,
                          solved: !filterData.solved,
                        });
                      }}
                    >
                      <BsCircle size={20} />
                      <button className="button__icon">Unsolved</button>
                    </div>
                  )}
                </div>

                <label className="label">Title:</label>
                <input
                  className="input-modal"
                  type="text"
                  value={filterData.title}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      title: e.target.value,
                    })
                  }
                />

                <label className="label">Description:</label>
                <input
                  className="input-modal"
                  type="text"
                  value={filterData.description}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      description: e.target.value,
                    })
                  }
                />

                <button className="button-filter">Filter</button>
              </form>
            </div>
          </main>
        ) : (
          <></>
        )}

        {taskFilterModal ? (
          <main className="modal-component">
            <div className="modal">
              <button
                className="button__icon"
                onClick={() => setTaskFilterModal(!taskFilterModal)}
              >
                <AiOutlineCloseCircle size={20} />
              </button>
              <form className="filter">
                <div className="filter__status">
                  {filterData.complete && (
                    <div
                      className="filter__solved"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterData({
                          ...filterData,
                          complete: !filterData.complete,
                        });
                      }}
                    >
                      <AiOutlineCheckCircle size={25} />
                      <button className="button__icon">Complete</button>
                    </div>
                  )}
                  {!filterData.complete && (
                    <div
                      className="filter__solved"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterData({
                          ...filterData,
                          complete: !filterData.complete,
                        });
                      }}
                    >
                      <BsCircle size={20} />
                      <button className="button__icon">Incomplete</button>
                    </div>
                  )}
                </div>

                <label className="label">Title:</label>
                <input
                  className="input-modal"
                  type="text"
                  value={filterData.title}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      title: e.target.value,
                    })
                  }
                />

                <label className="label">Description:</label>
                <input
                  className="input-modal"
                  type="text"
                  value={filterData.description}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      description: e.target.value,
                    })
                  }
                />

                <button className="button-filter">Filter</button>
              </form>
            </div>
          </main>
        ) : (
          <></>
        )}

        {projectFilterModal ? (
          <main className="modal-component">
            <div className="modal">
              <button
                className="button__icon"
                onClick={() => setProjectFilterModal(!projectFilterModal)}
              >
                <AiOutlineCloseCircle size={20} />
              </button>
              <form className="filter">
                <label className="label">Name:</label>
                <input
                  className="input-modal"
                  type="text"
                  value={filterData.name}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      name: e.target.value,
                    })
                  }
                />

                <label className="label">Description:</label>
                <input
                  className="input-modal"
                  type="text"
                  value={filterData.description}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      description: e.target.value,
                    })
                  }
                />

                <button className="button-filter">Filter</button>
              </form>
            </div>
          </main>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
};
