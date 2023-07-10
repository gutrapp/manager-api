import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Project } from "./pages/Project";
import { Profile } from "./pages/Profile";
import { Task } from "./pages/Task";
import { Bug } from "./pages/Bug";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/project/:project_id",
    element: <Project />,
  },
  {
    path: "/developer",
    element: <Profile />,
  },
  {
    path: "/task/:task_id",
    element: <Task />,
  },
  {
    path: "/bug/:bug_id",
    element: <Bug />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
