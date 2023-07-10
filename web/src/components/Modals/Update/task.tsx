import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ModalInputExtraId } from "../../../types/modal-data";
import { TaskData } from "../../../types/task";
import Cookies from "js-cookie";

export const UpdateTaskModal = ({
  display,
  onClose,
  id,
  specific_id,
}: ModalInputExtraId) => {
  const [data, setData] = useState<TaskData>({
    complete: false,
    description: "",
    title: "",
    developers: [id],
    project: "",
    creator_id: id,
  });

  const GetData = useQuery({
    queryKey: ["data-task"],
    queryFn: async () =>
      await axios
        .get(`http://127.0.0.1:8000/api/task/${id}`, {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setData(response.data);
        }),
  });

  const UpdateTask = useMutation({
    mutationKey: ["Update-task"],
    mutationFn: async () =>
      await axios.put(`http://127.0.0.1:8000/api/task/${id}`, data, {
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
            UpdateTask.mutate();
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

          <button className="button">Update Task</button>
        </form>
      </div>
    </main>
  );
};
