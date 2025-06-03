const API_URL = import.meta.env.VITE_API_URL;

function ConversationsList({setSelectedConversation, setSelectedUser, mobileView, myConversations}) {
        
    return (
  <div className="conversationsList">
    <div>
      {myConversations.length > 0 ? (
        myConversations.slice().sort((a, b) => {
          const aLast = a.messages?.[0]?.createdAt ?? a.createdAt;
          const bLast = b.messages?.[0]?.createdAt ?? b.createdAt;
          return new Date(bLast) - new Date(aLast);}).map((conversation) => (
          <div
            key={conversation.id}
            id={conversation.id}
            className="conversationSection"
            onClick={() => {
              setSelectedConversation(conversation.id);
              setSelectedUser(conversation.participants.map(p => p.user ?? { id: null, username: "Deleted User"}));
              mobileView();
            }}
          >
            {conversation.isGroup ? (
              <div className="participants">
                <p>{conversation.name}</p>
              </div>
            ) : Array.isArray(conversation.participants) ? (
              <div className="participants">
                {conversation.participants.map((participant, index) => (
                    <p key={index}>
                        {participant.user.isDeleted ? "Deleted User" : participant.user.username}
                    </p>
                )
                
                )}
                <div className="unread-count">{conversation._count.messages}</div>
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
);

}

export default ConversationsList;