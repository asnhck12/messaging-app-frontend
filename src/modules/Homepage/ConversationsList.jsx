import { fetchWithAuth } from "../../utils/api";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function ConversationsList({setSelectedConversation, setSelectedUser}) {
    const [myConversations, setMyConversations] = useState([]);

    const fetchMyConversations = async () => {
            try {
                const response = await fetchWithAuth(`${API_URL}/conversations/find`);
                const data = await response.json();
                setMyConversations(data.conversations || []);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        useEffect(() => {
            fetchMyConversations();
        }, []);
        
    return (
  <div className="conversationsList">
    <div>
      {myConversations.length > 0 ? (
        myConversations.map((conversation) => (
          <div
            key={conversation.id}
            id={conversation.id}
            className="conversationSection"
            onClick={() => {
              setSelectedConversation(conversation.id);
              setSelectedUser(conversation.participants.map(p => p.user));
            }}
          >
            {conversation.isGroup ? (
              <div className="participants">
                <p>{conversation.name}</p>
              </div>
            ) : Array.isArray(conversation.participants) ? (
              <div className="participants">
                {conversation.participants.map((participant, index) => (
                  <p key={index}>{participant.user.username}</p>
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
);

}

export default ConversationsList;