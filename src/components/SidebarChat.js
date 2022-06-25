// import React from 'react'
// import { Avatar } from '@material-ui/core'
// import '../css/SidebarChat.css'

// function SidebarChat({ id, name, chatImage }) {
//   return (
//     <div className='sidebarChat'>
//       <Avatar src={chatImage} />
//       <div className='sidebarChatInfo'>
//         <small>Timestamp</small>
//         <h3>{name}</h3>
//         <p>Message</p>
//       </div>
//     </div>
//   )
// }

// export default SidebarChat

// import React from 'react'
// import { Avatar } from '@material-ui/core'
// import '../css/SidebarChat.css'
// import { useDispatch, useSelector } from 'react-redux'
// import { selectChatId, setChatInfo } from '../features/chatSlice'

// function SidebarChat({ id, name, chatImage }) {
//   const dispatch = useDispatch()
//   return (
//     <div
//       className='sidebarChat'
//       onClick={() =>
//         dispatch(
//           setChatInfo({
//             chatId: id,
//             chatName: name,
//             chatImage: chatImage,
//           })
//         )
//       }
//     >
//       <Avatar src={chatImage} />
//       <div className='sidebarChatInfo'>
//         <small>Timestamp</small>
//         <h3> {name}</h3>
//         <p>Message</p>
//       </div>
//     </div>
//   )
// }

// export default SidebarChat

import { Avatar } from '@material-ui/core'
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/SidebarChat.css'
import { selectChatId, setChatInfo } from '../features/chatSlice'
import db from '../firebase'
import * as timeago from 'timeago.js'
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'
const SidebarChats = forwardRef(({ id, name, chatImage }, ref) => {
  const dispatch = useDispatch()
  const chatId = useSelector(selectChatId)

  const [lastMessage, setLastMessage] = useState('')

  useEffect(() => {
    const getLastMessage = async () => {
      const chatsRef = collection(db, `chats/${id}/messages`)
      const q = query(chatsRef, orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        setLastMessage(doc.data().timestamp.seconds)
      })
    }
    getLastMessage()
  }, [id])
  // console.log(lastMessage)
  return (
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
        <small>{timeago.format((lastMessage))}</small>
        <h5>{name}</h5>
        <p>{lastMessage[0]?.message}</p>
      </div>
    </div>
  )
})

export default SidebarChats
