import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Card } from "flowbite-react";
import Transfer from "./Transfer";

const Transactions: React.FC = () => {
    const auth = useAuth();

    const [transactions, setTransactions] = useState<
        {
            id: string;
            amount: number;
            image?: string;
            peer: string;
            time: string;
        }[]
    >([]);

    useEffect(() => {
        auth.fetch("/api/broker/account").then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    data.transactions.reverse();
                    setTransactions(data.transactions);
                });
            }
        });
    }, [auth]);

    return (
        <div className="flex flex-col md:flex-row w-full">
            <div className="inline-block">
                <Transfer />
            </div>
            <div className="inline-block">
                <ul className="flex flex-col gap-4">
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            <Card
                                imgAlt={transaction.image && "Image"}
                                imgSrc={transaction.image}
                                className="max-w-md"
                            >
                                <span
                                    className="font-semibold text-2xl"
                                    style={{
                                        color:
                                            transaction.amount > 0
                                                ? "green"
                                                : "red",
                                    }}
                                >
                                    {transaction.amount} $WMC
                                </span>
                                <span>
                                    {transaction.peer === auth.user?.username
                                        ? transaction.amount > 0
                                            ? "Deposited"
                                            : "Withdrawn"
                                        : (transaction.amount > 0
                                              ? "Received by"
                                              : "Sent to") +
                                          " " +
                                          transaction.peer}
                                </span>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Transactions;
