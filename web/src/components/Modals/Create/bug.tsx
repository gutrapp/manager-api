import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BugData } from "../../../types/bug";
import { ModalInput } from "../../../types/modal-data";
import Cookies from "js-cookie";

export const CreateBugModal = ({ display, onClose, id }: ModalInput) => {
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
    mutationFn: async () =>
      await axios.post("http://127.0.0.1:8000/api/bug", data, {
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
