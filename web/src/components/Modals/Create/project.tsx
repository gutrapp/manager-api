import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ModalInput } from "../../../types/modal-data";
import { ProjectData } from "../../../types/project";

export const CreateProjectModal = ({ display, onClose, id }: ModalInput) => {
  const [data, setData] = useState<ProjectData>({
    description: "",
    developers: [id],
    name: "",
    creator_id: id,
  });

  const CreateProject = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async () =>
      await axios.post("http://127.0.0.1:8000/api/project", data, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      }),
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
