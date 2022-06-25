import React, { useState, useEffect } from 'react'
import { Avatar, IconButton, Input } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import '../css/Sidebar.css'
import { Add } from '@material-ui/icons'
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes'
import SidebarChat from './SidebarChat'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import db, { auth } from '../firebase'
import Modal from 'react-modal'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDocs,
  query,
} from 'firebase/firestore'
import FlipMove from 'react-flip-move'

function Sidebar() {
  const user = useSelector(selectUser)
  const [modal, setModal] = useState(false)
  const [chats, setChats] = useState([])
  const [nameInput, setNameInput] = useState('')
  const [imageInput, setImageInput] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Signal-Logo.svg/150px-Signal-Logo.svg.png'
  )
  useEffect(() => {
    const getChats = async () => {
      const chatsRef = collection(db, 'chats')
      const q = query(chatsRef)
      const querySnapshot = await getDocs(q)
      let data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, chatName: doc.data() })
      })
      setChats(data)
    }
    getChats()
  }, [])
  const addNewChat = () => {
    if (nameInput) {
      const addChat = async () => {
        const docRef = await addDoc(collection(db, 'chats'), {
          chatName: nameInput,
          chatImage: imageInput,
          timestamp: serverTimestamp(),
        })
        console.log('Document written with ID: ', docRef.id)
      }
      addChat()
    }
    setNameInput('')
    setImageInput(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Signal-Logo.svg/150px-Signal-Logo.svg.png'
    )
    setModal(false)
  }
  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar
          src={user.photo}
          onClick={() => auth.signOut()}
          style={{
            cursor: 'pointer',
          }}
        />
        <div className='sidebar__input'>
          <SearchIcon />
          <input
            type='text'
            placeholder='Search'
            style={{ color: '#f6f6f6' }}
          />
        </div>
        <Add
          onClick={() => setModal(true)}
          style={{
            color: 'white',
            fontSize: 'xx-large',
            paddingLeft: '10px',
            cursor: 'pointer',
          }}
        />
        <Modal
          isOpen={modal}
          onRequestClose={() => setModal(false)}
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
          style={{
            overlay: {
              width: 500,
              height: 550,
              zIndex: '1000',
              background: 'rgba(0,0,0,0.8)',
              top: '50%',
              left: '50%',
              marginTop: '-225px',
              marginLeft: '-250px',
            },
          }}
        >
          <div className='modal__info'>
            <h5 style={{ marginTop: '40px' }}>HandCrafted With ❤️ By</h5>
            <h2 style={{ textAlign: 'center' }}>
              Kartikeya, Lakshay and Mandeep
            </h2>
            <h3>Add New Chat Name</h3>
            <Input
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className='name__input'
              type='text'
              placeholder='Enter new Chat Name'
            />
            <h3>Add Profile Image (URL)</h3>
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className='name__input'
              type='text'
              placeholder='Enter Chat Image (URL)'
            />

            <div className='modal__add'>
              <IconButton onClick={addNewChat}>
                <Add style={{ fontSize: 'xx-large', color: 'white' }} />
              </IconButton>
            </div>
            <button onClick={() => setModal(false)}>Close</button>
          </div>
        </Modal>
      </div>
      <div className='sidebar__chats'>
        {chats.map(({ id, chatName }) => (
          <SidebarChat
            key={id}
            id={id}
            name={chatName.chatName}
            chatImage={chatName.chatImage}
          />
        ))}
      </div>
      <div className='sidebar__notes'>
        <div className='sidebar__notesIcon'>
          <SpeakerNotesIcon />
        </div>
        <p>Note to self</p>
      </div>
    </div>
  )
}

export default Sidebar

