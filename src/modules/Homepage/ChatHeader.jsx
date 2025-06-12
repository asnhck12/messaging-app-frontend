import React from "react";
import { Link } from "react-router-dom";
import backIcon from "../../assets/images/backicon.svg";

const ChatHeader = ({ groupName, selectedUser, onlineUserIds, mobileView }) => {
  return (
    <>
    <div className="chatHeader">
    <div className="messagePanelViewButton">
          <img src={backIcon} onClick={mobileView} />
        </div>
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
    </div>
    </>
  );
};

export default ChatHeader;
