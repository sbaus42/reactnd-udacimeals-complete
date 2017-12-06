import React from 'react'
import ShoppingList from './ShoppingList'
import Modal from 'react-modal'

const ShoppingListModal = (props) => {
  const {
    closeModal,
    modalStatus,
    generateShoppingList } = props

  return (
    <Modal
      className='modal'
      overlayClassName='overlay'
      isOpen={modalStatus}
      onRequestClose={closeModal}
      contentLabel='Modal'
    >
      {modalStatus && <ShoppingList list={generateShoppingList()} /> }
    </Modal>
  )
}

export default ShoppingListModal
