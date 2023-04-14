import { createStore, createStyleSet } from 'botframework-webchat';
import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';

import './fabric-icons-inline.css';
import './MinimizableWebChat.css';
import WebChat from './WebChat';

const MinimizableWebChat = () => {
  // Create the store
  const store = useMemo(() => {
    
    const middleware = ({ dispatch }) => next => action => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        // Send a 'webchat/join' event when the Direct Line connection is established
        dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: 'webchat/join',
            value: {
              language: window.navigator.language
            }
          }
        });
      } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        // Set a flag when a new message is received from the bot
        if (action.payload.activity.from.role === 'bot') {
          setNewMessage(true);
        }
      }
      return next(action);
    };
    return createStore({}, middleware);
  }, []);

  // Create the styleSet
  const styleSet = useMemo(
    () =>
      createStyleSet({
        backgroundColor: 'Transparent',
        avatarSize: 40,
        botAvatarImage: 'https://docs.microsoft.com/en-us/azure/bot-service/v4sdk/media/logo_bot.svg?view=azure-bot-service-4.0',
        userAvatarImage: 'https://docs.microsoft.com/en-us/azure/bot-service/v4sdk/media/logo_bot.svg?view=azure-bot-service-4.0',
      }),
    []
  );

  // Set up state variables
  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [newMessage, setNewMessage] = useState(false);
  const [side, setSide] = useState('right');
  const [token, setToken] = useState();
  
  // Define event handlers
  const handleFetchToken = useCallback(async () => {
    // Fetch the Direct Line token if it hasn't been fetched yet
    if (!token) {
      const res = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer tnMNRSl5qiU.hFRktf6n_3Fo7jGUsrJe1BGAV0hTIZIImnOyw8GHMnY',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ User: { Id: 'user1' } })
      });
      const { token } = await res.json();
      setToken(token);
    }
  }, [setToken, token]);

  const handleMaximizeButtonClick = useCallback(() => {
    // Show the chat box and reset the new message flag when the maximize button is clicked
    setLoaded(true);
    setMinimized(false);
    setNewMessage(false);
  }, [setLoaded, setMinimized, setNewMessage]);

  const handleMinimizeButtonClick = useCallback(() => {
    // Hide the chat box and reset the new message flag when the minimize button is clicked
    setMinimized(true);
    setNewMessage(false);
  }, [setMinimized, setNewMessage]);

  const handleSwitchButtonClick = useCallback(() => {
    setSide(side === 'left' ? 'right' : 'left');
  }, [setSide, side]);

  return (
    <div className="minimizable-web-chat">
      {minimized && (
        <button className="maximize" onClick={handleMaximizeButtonClick}>
          <span className={token ? 'ms-Icon ms-Icon--MessageFill' : 'ms-Icon ms-Icon--Message'} />
          {newMessage && <span className="ms-Icon ms-Icon--CircleShapeSolid red-dot" />}
        </button>
      )}
      {loaded && (
        <div className={classNames(side === 'left' ? 'chat-box left' : 'chat-box right', minimized ? 'hide' : '')}>
          <header>
            <div className="filler" />
            <button className="switch" onClick={handleSwitchButtonClick}>
              <span className="ms-Icon ms-Icon--Switch" />
            </button>
            <button className="minimize" onClick={handleMinimizeButtonClick}>
              <span className="ms-Icon ms-Icon--ChromeMinimize" />
            </button>
          </header>
          <WebChat
            className="react-web-chat"
            onFetchToken={handleFetchToken}
            store={store}
            styleSet={styleSet}
            token={token}
          />
        </div>
      )}
    </div>
  );
};

export default MinimizableWebChat;
