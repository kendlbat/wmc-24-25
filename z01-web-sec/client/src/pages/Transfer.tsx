import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Button, Card, Label, TextInput } from "flowbite-react";

const Transfer: React.FC = () => {
    const auth = useAuth();
    const [csrfToken, setCsrfToken] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);
    const [message, _setMessage] = useState<string | null>(null);
    const [twostage, _setTwostage] = useState<number>(0);

    const setTwostage = (twostage: number) => {
        _setTwostage(twostage);
        setTimeout(() => {
            _setTwostage(0);
        }, 5000);
    };

    const setMessage = (message: string | null) => {
        _setMessage(message);
        setTimeout(() => {
            _setMessage(null);
        }, 5000);
    };

    useEffect(() => {
        // Read: https://stackoverflow.com/a/33829607 for information on CSRF tokens
        auth.fetch("/api/broker/csrf").then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setCsrfToken(data.csrf);
                });
            } else {
                setMessage("Failed to fetch CSRF token");
            }
        });
    }, [auth]);

    useEffect(() => {
        auth.fetch("/api/broker/account").then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    setBalance(data.balance);
                });
            } else {
                setMessage("Failed to fetch balance");
            }
        });
    }, [auth]);

    return (
        <div>
            <div>
                <Card className="max-w-md">
                    <form
                        className="flex flex-col gap-4"
                        action=""
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            const form = ev.target as HTMLFormElement;
                            const formData = new FormData(form);
                            const data = Object.fromEntries(formData.entries());
                            auth.fetch("/api/broker/transfer", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                            }).then((res) => {
                                if (res.ok) {
                                    setMessage("Transfer successful");
                                } else {
                                    res.json().then((data) => {
                                        setMessage(data.error);
                                    });
                                }
                            });
                        }}
                    >
                        <input type="hidden" name="csrf" value={csrfToken} />
                        <div>
                            <div className="block mb-1">
                                <Label htmlFor="peer" value="Peer" />
                            </div>
                            <TextInput
                                id="peer"
                                type="text"
                                name="peer"
                                placeholder="Peer"
                                defaultValue={"admin"}
                            />
                        </div>
                        <div>
                            <div className="block mb-2">
                                <Label htmlFor="amount" value="Amount" />
                            </div>
                            <TextInput
                                id="amount"
                                type="number"
                                name="amount"
                                placeholder="Amount"
                            />
                        </div>
                        <p>Your balance: {balance}</p>
                        <Button
                            type="submit"
                            disabled={message !== null}
                            onClick={(
                                ev: React.MouseEvent<Element, MouseEvent>
                            ) => {
                                if (twostage < 2) {
                                    ev.preventDefault();
                                    setTwostage(twostage + 1);
                                }
                            }}
                        >
                            {twostage === 0 && "Securely transfer funds"}
                            {twostage === 1 && "Click to confirm transfer"}
                            {twostage === 2 &&
                                "SchurbelAuth: Click again to confirm transfer"}
                        </Button>
                        {message && <p>{message}</p>}
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Transfer;
