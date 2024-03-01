// UserData.jsx
import React from "react";

const UserData = ({ users }) => {
  return (
    <>
      {users.map((curUser) => (
        <tr key={curUser.sno}>
          <td>{curUser.sno}</td>
          <td>{curUser.customer_name}</td>
          <td>{curUser.age}</td>
          <td>{curUser.phone}</td>
          <td>{curUser.location}</td>
          <td>{curUser.created_at}</td>
        </tr>
      ))}
    </>
  );
};

export default UserData;
