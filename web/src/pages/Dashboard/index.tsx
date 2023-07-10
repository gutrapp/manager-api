import {
  AiFillFolderAdd,
  AiOutlineFileAdd,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BsCircle } from "react-icons/bs";
import { BiAddToQueue } from "react-icons/bi";
import { HiOutlineFilter } from "react-icons/hi";
import { Layout } from "../../components/Layout";
import { useState } from "react";
import "./index.css";
import { Project, ProjectData } from "../../types/project";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Bug, BugData } from "../../types/bug";
import { Task, TaskData } from "../../types/task";

export const Dashboard = () => {
  const router = useNavigate();

  const [userId, setUserId] = useState<number>(0);

  const [description, setDescription] = useState<string>("");

  const [name, setName] = useState<string>("");

  const [title, setTitle] = useState<string>("");

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
    queryFn: async () => {
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

          return response.data;
        });
    },
  });

  const GetUserProjects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      await axios
        .get("http://127.0.0.1:8000/api/developer/projects", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setProjects(response.data);

          return response.data;
        });
    },
  });

  const GetUserBugs = useQuery({
    queryKey: ["bugs"],
    queryFn: async () => {
      await axios
        .get("http://127.0.0.1:8000/api/developer/bugs", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setBugs(response.data);

          return response.data;
        });
    },
  });

  const GetUserTasks = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      await axios
        .get("http://127.0.0.1:8000/api/developer/tasks", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setTasks(response.data);

          return response.data;
        });
    },
  });

  const DeleteProject = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async (id: number) => {
      await axios.delete(`http://127.0.0.1:8000/api/project/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
      return true;
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const DeleteTask = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: async (id: number) => {
      await axios.delete(`http://127.0.0.1:8000/api/task/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });

      return true;
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const DeleteBug = useMutation({
    mutationKey: ["delete-bug"],
    mutationFn: async (id: number) => {
      await axios.delete(`http://127.0.0.1:8000/api/bug/${id}`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
      return true;
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  const UpdateTask = useMutation({
    mutationKey: ["update-task"],
    mutationFn: async (id: number) => {
      const data = {
        title: tasks[id].title,
        description: tasks[id].description,
        complete: tasks[id].complete,
      };

      await axios.put(
        `http://127.0.0.1:8000/api/task/${id}`,
        {
          data,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      );
      return true;
    },
  });

  const UpdateBug = useMutation({
    mutationKey: ["update-bug"],
    mutationFn: async (id: number) => {
      const data = {
        description: bugs[id].description,
        solved: bugs[id].solved,
        title: bugs[id].title,
      };

      await axios.put(
        `http://127.0.0.1:8000/api/bug/${id}`,
        {
          data,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      );
      return true;
    },
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
                            UpdateTask.mutate(task.id);
                            let arr = [...tasks];
                            arr[i].complete = !arr[i].complete;
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
                            UpdateTask.mutate(task.id);
                            let arr = [...tasks];
                            arr[i].complete = !arr[i].complete;
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
                            UpdateBug.mutate(bug.id);
                            let arr = [...bugs];
                            arr[i].solved = !arr[i].solved;
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
                            UpdateBug.mutate(bug.id);
                            let arr = [...bugs];
                            arr[i].solved = !arr[i].solved;
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

        {bugFilterModal ? (
          <main className="modal-component">
            <div className="modal">
              <button
                className="button__icon"
                onClick={() => setBugFilterModal(!bugFilterModal)}
              >
                <AiOutlineCloseCircle size={25} />
              </button>
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
                <AiOutlineCloseCircle size={25} />
              </button>
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
                <AiOutlineCloseCircle size={25} />
              </button>
            </div>
          </main>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
};

interface ModalInput {
  display: boolean;
  onClose: () => void;
  id: number;
}

const CreateProjectModal = ({ display, onClose, id }: ModalInput) => {
  const [data, setData] = useState<ProjectData>({
    description: "",
    developers: [id],
    name: "",
    creator_id: id,
  });

  const CreateProject = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async () => {
      await axios.post("http://127.0.0.1:8000/api/project", data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  if (!display) return null;

  return (
    <main className="modal-component">
      <div className="modal">
        <button className="button__icon" onClick={() => onClose()}>
          <AiOutlineCloseCircle size={25} />
        </button>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            CreateProject.mutate();
          }}
        >
          <label className="label">Name:</label>
          <input
            className="input-modal"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <label className="label">Description:</label>
          <textarea
            className="input-modal"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />

          <button className="button">Create Project</button>
        </form>
      </div>
    </main>
  );
};

const CreateTaskModal = ({ display, onClose, id }: ModalInput) => {
  const [data, setData] = useState<TaskData>({
    complete: false,
    description: "",
    title: "",
    developers: [id],
    project: "",
    creator_id: id,
  });

  const CreateTask = useMutation({
    mutationKey: ["create-task"],
    mutationFn: async () => {
      await axios.post("http://127.0.0.1:8000/api/task", data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  if (!display) return null;

  return (
    <main className="modal-component">
      <div className="modal">
        <button className="button__icon" onClick={() => onClose()}>
          <AiOutlineCloseCircle size={25} />
        </button>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            CreateTask.mutate();
          }}
        >
          <label className="label">Title:</label>
          <input
            className="input-modal"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />

          <label className="label">Description:</label>
          <textarea
            className="input-modal"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />

          <label className="label">Project Id:</label>
          <input
            className="input-modal"
            value={data.project}
            onChange={(e) => setData({ ...data, project: e.target.value })}
          />

          <button className="button">Create Task</button>
        </form>
      </div>
    </main>
  );
};

const CreateBugModal = ({ display, onClose, id }: ModalInput) => {
  const [data, setData] = useState<BugData>({
    solved: false,
    description: "",
    title: "",
    developer: id,
    project: "",
    task: "",
  });

  const CreateBug = useMutation({
    mutationKey: ["create-bug"],
    mutationFn: async () => {
      await axios.post("http://127.0.0.1:8000/api/bug", data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      });
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  if (!display) return null;

  return (
    <main className="modal-component">
      <div className="modal">
        <button className="button__icon" onClick={() => onClose()}>
          <AiOutlineCloseCircle size={25} />
        </button>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            CreateBug.mutate();
          }}
        >
          <label className="label">Title:</label>
          <input
            className="input-modal"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />

          <label className="label">Description:</label>
          <textarea
            className="input-modal"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />

          <label className="label">Project Id:</label>
          <input
            className="input-modal"
            value={data.project}
            onChange={(e) => setData({ ...data, project: e.target.value })}
          />

          <label className="label">Task Id:</label>
          <input
            className="input-modal"
            value={data.task}
            onChange={(e) => setData({ ...data, task: e.target.value })}
          />

          <button className="button">Create Bug</button>
        </form>
      </div>
    </main>
  );
};
