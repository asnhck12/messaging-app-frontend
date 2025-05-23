import React from "react";
import { Link } from "react-router-dom";

const ChatHeader = ({ groupName, selectedUser, onlineUserIds }) => {
  return (
    <div className="messageTitle">
      {groupName && <h3>{groupName}</h3>}

      {selectedUser.map((user, index) => (
        <span key={user.id}>
            {user.isDeleted ? (
                <span>Deleted User</span>
            ) : (
            <Link to={`/profile/${user.id}`}>{user.username}</Link>
            )}
            <span style={{ color: onlineUserIds.has(user.id) ? "green" : "gray" }}>
                ● {onlineUserIds.has(user.id) ? "Online" : "Offline"}
            </span>
            {index < selectedUser.length - 1 && ", "}
            </span>
        ))}
    </div>
  );
};

export default ChatHeader;
