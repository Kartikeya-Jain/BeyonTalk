// import React from 'react'
// import '../css/Chat.css'
// import StyleIcon from '@material-ui/icons/Style'
// import SearchIcon from '@material-ui/icons/Search'
// import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
// import Message from './Message'
// import { Add, EmojiEmotions, MicNone } from "@material-ui/icons";
// import { Avatar } from '@material-ui/core'

// function Chat() {
//   return (
//   <div className='chat'>
//     <div className='chat__header'>
//       <div className='chat__headerLeft'>
//         <Avatar />
//         <h5>Chat Name</h5>
//       </div>
//       <div className='chat__headerRight'>
//         <SearchIcon />
//         <MoreHorizIcon />
//       </div>
//     </div>
//     <div className='chat__body'>
//       <div className='message__header'>
//         <Avatar />
//         <h3> Chat Name </h3>
//       </div>
//       <Message />
//       <Message />
//       <Message />
//       <Message />
//     </div>
//      <div className="class__footer">
//          <EmojiEmotions />
//          <form>
//           <input
//            placehoder = "Send a Message"
//            type = "text"

//           />
//           <button
//             type = "submit">
//               Send

//           </button>

//           </form>
//           <div className = "chat_footerIcons">
//             <StyleIcon />
//             <MicNone />
//             <Add/>
//           </div>

//   </div>
//   </div>
//   )
// }
// export default Chat
import React, { useEffect, useState } from 'react'
import '../css/Chat.css'
import StyleIcon from '@material-ui/icons/Style'
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Message from './Message'
import { Add, EmojiEmotions, MicNone } from '@material-ui/icons'
import { Avatar } from '@material-ui/core'
import { useSelector } from 'react-redux'
import db from '../firebase'
import FlipMove from 'react-flip-move'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'

import {
  selectChatId,
  selectChatImage,
  selectChatName,
} from '../features/chatSlice'
import { selectUser } from '../features/userSlice'

function Chat() {
  const user = useSelector(selectUser)
  const chatImage = useSelector(selectChatImage)
  const chatName = useSelector(selectChatName)
  const chatId = useSelector(selectChatId)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const getMessages = async () => {
      const chatsRef = collection(db, `chats/${chatId}/messages`)
      const q = query(chatsRef, orderBy('timestamp', 'asc'))
      const querySnapshot = await getDocs(q)
      let data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, message: doc.data() })
      })
      setMessages(data)
    }
    getMessages()
  }, [chatId, messages])

  // console.log(messages)

  const handleMessage = (e) => {
    e.preventDefault()
    if (chatId) {
      console.log(input)
      const addMessage = async () => {
        const docRef = await addDoc(
          collection(db, `chats/${chatId}/messages`),
          {
            user: user,
            message: input,
            timestamp: serverTimestamp(),
          }
        )
        console.log('Document written with ID: ', docRef.id)
      }
      addMessage()
    }
    setInput('')
  }

  return (
    <div className='chat'>
      <div className='chat_header'>
        <div className='chat_headerleft'>
          <Avatar src={chatImage} />
          <h5>{chatName}</h5>
        </div>
        <div className='chat_headerright'>
          <SearchIcon />
          <MoreHorizIcon />
        </div>
      </div>
      <div className='chat_body'>
        <div className='message_header'>
          <Avatar src={chatImage} />
          <h3> {chatName} </h3>
        </div>
        <FlipMove>
          {messages.map(({ id, message }) => (
            <Message
              key={id}
              id={id}
              message={message.message}
              timestamp={message.timestamp}
              sender={message.user.email}
              senderName={message.user.displayName}
            />
          ))}
        </FlipMove>
      </div>
      <div className='chat_footer'>
        <EmojiEmotions />
        <form>
          <input
            value={input}
            required
            onChange={(e) => setInput(e.target.value)}
            placehoder='Send a Message'
            type='text'
          />
          <button type='submit' onClick={handleMessage}>
            Send
          </button>
        </form>
        <div className='chat_footerIcons'>
          <StyleIcon />
          <MicNone />
          <Add />
        </div>
      </div>
    </div>
  )
}
export default Chat
