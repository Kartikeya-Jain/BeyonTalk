import { Avatar } from '@material-ui/core'
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/SidebarChat.css'
import { selectChatId, setChatInfo } from '../features/chatSlice'
import db from '../firebase'
import moment from 'moment'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const SidebarChats = forwardRef(({ id, name, chatImage }, ref) => {
  const dispatch = useDispatch()
  const chatId = useSelector(selectChatId)
  const [lastMessage, setLastMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getLastMessage = async () => {
      const chatsRef = collection(db, `chats/${id}/messages`)
      const q = query(chatsRef, orderBy('timestamp', 'asc'))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setLastMessage(doc.data())
        setLoading(false)
      })
    }
    getLastMessage()
  }, [id])
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div
      ref={ref}
      className='sidebarChat'
      onClick={() =>
        dispatch(
          setChatInfo({
            chatId: id,
            name: name,
            chatImage: chatImage,
          })
        )
      }
    >
      <Avatar src={chatImage} />
      <div className='sidebarChatInfo'>
        <small>
          {moment
            .unix(lastMessage?.timestamp.seconds)
            .local()
            .startOf('seconds')
            .fromNow()}
        </small>
        <h5>{name}</h5>
        <p>{lastMessage?.message}</p>
      </div>
    </div>
  )
})

export default SidebarChats
