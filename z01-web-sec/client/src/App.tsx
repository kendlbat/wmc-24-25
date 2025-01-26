import { Suspense } from "react";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { Loading } from "./components/Loading";
import { Navbar } from "flowbite-react";
import { useAuth } from "./lib/auth";
import { Login } from "./components/Login";

function App() {
    const auth = useAuth();

    return (
        <div className="absolute top-0 left-0 flex flex-col h-full w-full">
            <header>
                <Navbar fluid rounded>
                    <Navbar.Brand as={Link} href="/">
                        <span className="self-center px-2 whitespace-nowrap text-xl font-semibold dark:text-white">
                            Bergbroker
                        </span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Navbar.Link as={Link} to="/">
                            <div className="text-lg p-2">Home</div>
                        </Navbar.Link>
                        <Navbar.Link as={Link} to="/transfer">
                            <div className="text-lg p-2">New Transfer</div>
                        </Navbar.Link>
                        {(auth.user?.roles as string[] | undefined)?.includes(
                            "admin"
                        ) && (
                            <Navbar.Link as={Link} to="/admin/users">
                                <div className="text-lg p-2">Admin</div>
                            </Navbar.Link>
                        )}
                        {auth.isSignedIn && (
                            <Navbar.Link as={Link} to="" onClick={auth.logout}>
                                <div className="text-lg p-2">Logout</div>
                            </Navbar.Link>
                        )}
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <main className="grow p-2 w-full">
                {auth.isSignedIn ? (
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                ) : (
                    <Login />
                )}
            </main>
        </div>
    );
}

export default App;
