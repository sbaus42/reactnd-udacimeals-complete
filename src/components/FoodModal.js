import React from 'react'
import Modal from 'react-modal'

const FoodModal = (props) => {
  const { foodModalStatus, closeFoodModal } = props

  return (
    <Modal
      className='modal'
      overlayClassName='overlay'
      isOpen={foodModalStatus}
      onRequestClose={closeFoodModal}
      contentLabel='Modal'
    >
      <div>

      </div>
    </Modal>
  )
}

export default FoodModal
