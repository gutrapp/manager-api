import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BugData } from "../../../types/bug";
import { ModalInputExtraId } from "../../../types/modal-data";
import Cookies from "js-cookie";

export const UpdateBugModal = ({
  display,
  onClose,
  id,
  specific_id,
}: ModalInputExtraId) => {
  const [data, setData] = useState<BugData>({
    solved: false,
    description: "",
    title: "",
    developer: id,
    project: "",
    task: "",
  });

  const GetData = useQuery({
    queryKey: ["data-bug"],
    queryFn: async () =>
      await axios
        .get(`http://127.0.0.1:8000/api/bug/${id}`, {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setData(response.data);
        }),
  });

  const UpdateBug = useMutation({
    mutationKey: ["Update-bug"],
    mutationFn: async () =>
      await axios.put(`http://127.0.0.1:8000/api/bug/${id}`, data, {
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
            UpdateBug.mutate();
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

          <button className="button">Update Bug</button>
        </form>
      </div>
    </main>
  );
};
