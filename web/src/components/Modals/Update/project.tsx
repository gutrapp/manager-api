import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ModalInputExtraId } from "../../../types/modal-data";
import { ProjectData } from "../../../types/project";
import Cookies from "js-cookie";

export const UpdateProjectModal = ({
  display,
  onClose,
  id,
  specific_id,
}: ModalInputExtraId) => {
  const [data, setData] = useState<ProjectData>({
    description: "",
    developers: [id],
    name: "",
    creator_id: id,
  });

  const GetData = useQuery({
    queryKey: ["data-project"],
    queryFn: async () =>
      await axios
        .get(`http://127.0.0.1:8000/api/project/${id}`, {
          withCredentials: true,
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })
        .then((response) => {
          setData(response.data);
        }),
  });

  const UpdateProject = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async () =>
      await axios.put(`http://127.0.0.1:8000/api/project/${id}`, data, {
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
            UpdateProject.mutate();
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

          <button className="button">Update Project</button>
        </form>
      </div>
    </main>
  );
};
