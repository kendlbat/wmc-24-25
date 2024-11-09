import Table from "react-bootstrap/Table";

import { PropTypes } from "prop-types";

function EmployeesTable({ employees }) {
    return (
        <>
            <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Employees</span>
            </h4>
            <Table bordered hover striped>
                <thead>
                    <tr>
                        <th>Last name</th>
                        <th>First name</th>
                        <th>Email</th>
                        <th>Facility</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((a) => (
                        <tr key={a._id}>
                            <td>{a.lastName}</td>
                            <td>{a.firstName}</td>
                            <td>{a.email}</td>
                            <td>{a.currentFacility.title}</td>
                            <td>{a.currentFacility.city}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default EmployeesTable;

EmployeesTable.propTypes = {
    employees: PropTypes.array,
};
