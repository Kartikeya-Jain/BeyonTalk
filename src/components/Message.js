import React, { forwardRef, useState } from 'react'
import { useSelector } from 'react-redux'
import '../css/Message.css'
import { selectUser } from '../features/userSlice'
import db from '../firebase'
import { doc, deleteDoc } from 'firebase/firestore'

const Message = forwardRef(
  ({ id, message, timestamp, sender, senderName, chatId }, ref) => {
    const user = useSelector(selectUser)
    const [deleted, setDeleted] = useState(false)
    const deleteHandler = async () => {
      console.log('Delelte Pressed')
      const res = await deleteDoc(doc(db, `chats/${chatId}/messages/`, `${id}`))
        .then(setDeleted(true))
        .catch((err) => console.log(err))
    }
    return !deleted ? (
      <div ref={ref} className='message'>
        <div
          className={`${
            user.email === sender ? `message__info` : `message__infoSender`
          }`}
        >
          <div className='message__content'>
            {user.email === sender ? null : <span>{senderName}</span>}
            <p>{message}</p>
            <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
          </div>
          {sender === user.email && (
            <i
              class='fa-solid fa-xmark'
              style={{ alignSelf: 'right', marginRight: '10px' }}
              onClick={deleteHandler}
            ></i>
          )}
        </div>
      </div>
    ) : (
      <></>
    )
  }
)

export default Message
