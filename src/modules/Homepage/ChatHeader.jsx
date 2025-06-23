import React from "react";
import { Link } from "react-router-dom";
import backIcon from "../../assets/images/backicon.svg";

const ChatHeader = ({ groupName, selectedUser, setSelectedUser, onlineUserIds, mobileView, setSelectedConversation}) => {
  return (
    <>
    <div className="chatHeader">
    <div className="messagePanelViewButton">
          <img src={backIcon} onClick={() => {mobileView(); setSelectedConversation(""); setSelectedUser([])}} />
        </div>
    <div className="messageTitle">
  {groupName && <h3>{groupName}</h3>}
  <div className="messageUserList">
  {selectedUser.map((user, index) => (
    <span key={user.id} style={{ marginRight: '10px' }}>
      {user.isDeleted ? (
        "Deleted User"
      ) : (
        <Link to={`/profile/${user.id}`}>{user.username}</Link>
      )}
      <span style={{ color: onlineUserIds.has(user.id) ? "green" : "gray", marginLeft: '5px' }}>
        ● {onlineUserIds.has(user.id) ? "Online" : "Offline"}
      </span>
      {index < selectedUser.length - 1 && <span> </span>}
    </span>
  ))}</div>
</div>
    </div>
    </>
  );
};

export default ChatHeader;
