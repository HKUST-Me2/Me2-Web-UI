import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';
import React, { useEffect, useMemo } from 'react';

import UserImage from './Icons/avatar_icon.png';
import BotImage from './Icons/chatbot_icon.png';

import './WebChat.css';

const WebChat = ({ className, onFetchToken, store, token }) => {
  const directLine = useMemo(() => createDirectLine({ token }), [token]);

  const styleSet = useMemo(
    () =>
      createStyleSet({
        backgroundColor: 'white',
        bubbleBorderRadius: 20, bubbleNubOffset: 5,
        bubbleNubSize: 10,
        bubbleFromUserNubSize: 10,
        bubbleFromUserBorderRadius: 20, 
        bubbleFromUserNubOffset: 5,
        bubbleFromUserBackground: '#0083e7'
      }),

    []
  );

  const styleOptions = {
    botAvatarImage: BotImage,
    //'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ22HRut4vhYrvwof7oDqAoH94a4IuAyAY9dvBKC1tLNw&s',
    botAvatarInitials: 'Me2',
    userAvatarImage: UserImage,
    userAvatarInitials: 'User'
  };
  
  useEffect(() => {
    onFetchToken();
  }, [onFetchToken]);

  return token ? (
    <ReactWebChat className={`${className || ''} web-chat`} 
      directLine={directLine} 
      store={store} 
      styleSet={styleSet} 
      styleOptions={styleOptions} />
  ) : (
    <div className={`${className || ''} connect-spinner`}>
      <div className="content">
        <div className="icon">
          <span className="ms-Icon ms-Icon--Robot" />
        </div>
        <p>Please wait while we are connecting.</p>
      </div>
    </div>
  );
};

export default WebChat;
