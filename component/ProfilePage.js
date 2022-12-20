import React from 'react'

const ProfilePage = () => {
  return (
    <div style={{ backgroundColor: 'white', marginLeft: 15, marginRight: 10, height: 130, borderRadius: 15 }}>
      <div className='row' style={{ paddingTop: 15, paddingLeft: 10 }}>
        <div className='col-4'>
          <img src={'./images/user.gif'} width={80} height={80} style={{ borderRadius: '50%' }} />

        </div>
        <div className='col-8'>
          <div className='row' style={{ fontSize: 15 }}>
            ชื่อ - สกุล :  
          </div>
          <div className='row' style={{ fontSize: 15, paddingTop: 20 }}>
            เบอร์โทร : 0931368858
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProfilePage