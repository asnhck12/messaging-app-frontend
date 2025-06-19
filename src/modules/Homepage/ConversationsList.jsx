const API_URL = import.meta.env.VITE_API_URL;
import profileicon from "../../assets/images/profileicon.svg";
import profilegroupicon from "../../assets/images/profilegroupicon.svg";


function ConversationsList({setSelectedConversation, selectedConversation, setSelectedUser, onlineUserIds, mobileView, myConversations, setGroupName}) {
        
 return (
  <div className="conversationsList">
    <div className="conversations">
      {myConversations.length > 0 ? (
        myConversations
          .slice()
          .sort((a, b) => {
            const aLast = a.messages?.[0]?.createdAt ?? a.createdAt;
            const bLast = b.messages?.[0]?.createdAt ?? b.createdAt;
            return new Date(bLast) - new Date(aLast);
          })
          .map((conversation) => (
            <div
              key={conversation.id}
              id={conversation.id}
              className={`conversationSection ${
                selectedConversation === conversation.id ? "selectedUser" : ""
              }`}
              onClick={() => {
                setSelectedConversation(conversation.id);
                setSelectedUser(
                  conversation.participants.map((p) => p.user ?? { id: null, username: "Deleted User" })
                );
                setGroupName(conversation.name);
                mobileView();
              }}
            >
              {conversation.isGroup ? (
                <div className="participants">
                  <div className="participantName">
                    <div className="participantsIconUsers">
                        <img src={profilegroupicon} />
                      </div>
                      <div
                        className="participantDetails"
                        style={{
                          fontWeight:
                            conversation._count.messages > 0 ? "bold" : "normal",
                        }}
                      >
                    <p>
                          {conversation.name}
                        </p>
                        {conversation._count.messages > 0 && (
                          <p className="unreadCount">
                            {conversation._count.messages}
                          </p>)}
                    </div>
                  </div>
                </div>
              ) : Array.isArray(conversation.participants) ? (
                <div className="participants">
                  {conversation.participants.map((participant) => (
                    <div key={participant.id} className="participantName">
                      <div
                        className={`participantsIconUsers ${
                          onlineUserIds.has(participant.user.id)
                            ? "userOnline"
                            : "userOffline"
                        }`}
                      >
                        <img src={profileicon} />
                      </div>
                      <div
                        className="participantDetails"
                        style={{
                          fontWeight:
                            conversation._count.messages > 0 ? "bold" : "normal",
                        }}
                      >
                        <p>
                          {participant.user.isDeleted
                            ? "Deleted User"
                            : participant.user.username}
                        </p>
                        {conversation._count.messages > 0 && (
                          <p className="unreadCount">
                            {conversation._count.messages}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No participants</p>
              )}
            </div>
          ))
      ) : (
        <p>No conversations found.</p>
      )}
    </div>
  </div>
);;

}

export default ConversationsList;