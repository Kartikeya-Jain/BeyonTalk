import React, { useEffect, useState } from 'react'
import '../css/Chat.css'
import StyleIcon from '@material-ui/icons/Style'
import SearchIcon from '@material-ui/icons/Search'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Message from './Message'
import { EmojiEmotions, MicNone, SendSharp } from '@material-ui/icons'
import { Avatar } from '@material-ui/core'
import { useSelector } from 'react-redux'
import db from '../firebase'
import FlipMove from 'react-flip-move'
import Picker, { SKIN_TONE_NEUTRAL } from 'emoji-picker-react'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDocs,
  query,
  orderBy,
  getDoc,
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
  const [showEmojiSelector, setShowEmojiSelector] = useState(false)
  const [chosenEmoji, setChosenEmoji] = useState(null)
  // const [newMessage, setNewMessage] = useState({})

  const onEmojiClick = (event, emojiObject) => {
    event.preventDefault()
    setChosenEmoji(emojiObject)
    console.log(chosenEmoji)
    const newInput = input + chosenEmoji.emoji
    setInput(newInput)
  }
  const addMessage = async () => {
    const docRef = await addDoc(collection(db, `chats/${chatId}/messages`), {
      user: user,
      message: input,
      timestamp: serverTimestamp(),
    })
    console.log('Document written with ID: ', docRef.id)
    getMessage(docRef.id)
  }

  const handleMessage = (e) => {
    e.preventDefault()
    if (chatId) {
      addMessage()
    }
    setInput('')
  }
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

  const getMessage = async (id) => {
    const msgRef = doc(db, `chats/${chatId}/messages/${id}`)
    const msgSnapshot = await getDoc(msgRef)
    console.log(msgSnapshot.data())
    const newMessage = {
      id,
      message: msgSnapshot.data(),
    }
    setMessages((state) => [...state, newMessage])
  }

  useEffect(() => {
    getMessages()
    console.log(messages)
  }, [chatId])

  const handleEmojiPicker = () => {
    if (showEmojiSelector === false) {
      setShowEmojiSelector(true)
    } else {
      setShowEmojiSelector(false)
    }
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
              chatId={chatId}
            />
          ))}
        </FlipMove>
      </div>
      <div className='chat_footer'>
        <EmojiEmotions onClick={handleEmojiPicker} />
        {showEmojiSelector && (
          <div>
            <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_NEUTRAL} />
          </div>
        )}
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
          <SendSharp onClick={handleMessage} />
        </div>
      </div>
    </div>
  )
}
export default Chat
