import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";

const AdminUserPage: React.FC = () => {
    const auth = useAuth();

    const [users, setUsers] = useState<Record<string, unknown>>({});

    useEffect(() => {
        auth.fetch("/api/users").then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setUsers(data);
                });
            }
        });
    }, [auth]);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {Object.entries(users).map(([key, value]) => (
                    <li key={key}>
                        <div>
                            <span>{key}</span>
                            <span>{JSON.stringify(value)}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUserPage;
