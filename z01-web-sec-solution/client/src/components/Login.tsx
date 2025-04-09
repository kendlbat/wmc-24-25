import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useAuth } from "../lib/auth";

export const Login: React.FC = () => {
    const auth = useAuth();
    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("password");

    return (
        <div className="flex justify-center items-center h-full w-full">
            <Card className="w-2/3 min-w-[300px] max-w-md">
                <form
                    action="/api/auth/login"
                    className="flex max-w-md flex-col gap-4"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        try {
                            auth.login(username, password);
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                >
                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="username" value="Username" />
                        </div>
                        <TextInput
                            id="username"
                            value={username}
                            onChange={(ev) => {
                                setUsername(ev.target.value);
                            }}
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="password" value="Password" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            value={password}
                            onChange={(ev) => {
                                setPassword(ev.target.value);
                            }}
                            placeholder="Password"
                        />
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </Card>
        </div>
    );
};
