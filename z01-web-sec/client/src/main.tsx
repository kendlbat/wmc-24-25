import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./lib/auth";

const Transactions = lazy(() => import("./pages/Transactions"));
const Transfer = lazy(() => import("./pages/Transfer"));
const AdminUserPage = lazy(() => import("./pages/AdminUserPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <p>404</p>,
        children: [
            {
                path: "",
                element: <Transactions />,
            },
            {
                path: "transfer",
                element: <Transfer />,
            },
            {
                path: "admin/users",
                element: <AdminUserPage />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
