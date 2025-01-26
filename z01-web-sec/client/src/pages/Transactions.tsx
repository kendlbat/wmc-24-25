import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { Card } from "flowbite-react";

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
        <ul className="flex flex-col items-center gap-4">
            {transactions.map((transaction) => (
                <li key={transaction.id}>
                    <a href={transaction.image}>
                        <Card
                            horizontal
                            imgAlt={transaction.image && "Image"}
                            imgSrc={transaction.image}
                            className="w-md card-image-contain"
                        >
                            <div>
                                <span
                                    className="font-semibold text-2xl block"
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
                                            ? "deposited"
                                            : "withdrawn"
                                        : (transaction.amount > 0
                                              ? "received from"
                                              : "sent to") +
                                          " " +
                                          transaction.peer}
                                </span>
                            </div>
                            <div className="text-gray-400">
                                {new Date(transaction.time).toLocaleString()}
                            </div>
                        </Card>
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default Transactions;
