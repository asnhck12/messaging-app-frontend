const API_URL = import.meta.env.VITE_API_URL;

function ConversationsList({setSelectedConversation, setSelectedUser, mobileView, myConversations}) {
        
    return (
  <div className="conversationsList">
    <div className="conversations">
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
                  <div className="participantName">
                    <p key={index}>
                      <span style={{ fontWeight: conversation._count.messages > 0 ? 'bold' : 'normal', color: "green" }}>
                        {participant.user.isDeleted ? 'Deleted User' : participant.user.username}
                        {conversation._count.messages > 0 ? ` (${conversation._count.messages})` : ''}</span>{" "}
                        </p>
                    </div>
                )
                
                )}
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