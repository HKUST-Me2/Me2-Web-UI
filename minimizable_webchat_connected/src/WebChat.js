import React, { useEffect, useMemo } from 'react';
import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';

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
        botAvatarImage: 'me2bot_logo.svg',
        userAvatarImage:'profile_pic.svg',
        bubbleFromUserBackground: '#0083e7'
      }),

    []
  );

  useEffect(() => {
    onFetchToken();
  }, [onFetchToken]);

  return token ? (
    <ReactWebChat className={`${className || ''} web-chat`} directLine={directLine} store={store} styleSet={styleSet} />
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
