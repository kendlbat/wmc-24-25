import EmployeesTable from "./EmployeesTable";

import Pagination from "react-bootstrap/Pagination";

import { useState, useEffect } from "react";

function EmployeesApp() {
    // use this constant to control the number of results per page
    const PAGE_SIZE = 15;

    const [employees, setEmployees] = useState([]);
    const [numResults, setNumResults] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        console.log("fetching data from backend");

        let numResults;

        fetch(
            `/api/employees?${new URLSearchParams({
                limit: PAGE_SIZE,
                offset: (page - 1) * PAGE_SIZE,
                embed: "(currentFacility)",
            }).toString()}`,
            {
                method: "GET",
                headers: {
                    Accept: `application/json`,
                },
            }
        )
            .then((response) => {
                if (!response.ok)
                    throw { status: response.status, msg: response.statusText };

                // total number of results is always returned via this extra header
                numResults = response.headers.get("x-num-results");
                return response.json();
            })
            .then((data) => {
                setEmployees(data);
                setNumResults(numResults);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [page, PAGE_SIZE]);

    return (
        <div className="container-fluid bg-light">
            <div className="row">
                <div className="text-center mb-2">
                    <h1>Employees App</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <Pagination className="px-4">
                        <Pagination.Item
                            onClick={() => setPage(1)}
                            key={"first"}
                            disabled={page === 1}
                        >
                            {" "}
                            First
                        </Pagination.Item>

                        <Pagination.Item
                            onClick={() => setPage(page - 1)}
                            key={"prev"}
                            active={false}
                            disabled={page === 1}
                        >
                            {" "}
                            &lt;
                        </Pagination.Item>

                        <Pagination.Item key={page} active={true}>
                            {" "}
                            {page}
                        </Pagination.Item>

                        <Pagination.Item
                            onClick={() => setPage(page + 1)}
                            key={"next"}
                            active={false}
                            disabled={page * PAGE_SIZE >= numResults}
                        >
                            {" "}
                            &gt;
                        </Pagination.Item>

                        <Pagination.Item
                            onClick={() =>
                                setPage(Math.ceil(numResults / PAGE_SIZE))
                            }
                            key={"last"}
                            disabled={
                                page === Math.ceil(numResults / PAGE_SIZE)
                            }
                        >
                            {" "}
                            Last
                        </Pagination.Item>
                    </Pagination>

                    <EmployeesTable employees={employees} />
                </div>
            </div>
        </div>
    );
}

export default EmployeesApp;
