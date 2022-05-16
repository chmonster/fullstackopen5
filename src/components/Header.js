import PropTypes from 'prop-types'

const Header = ({ user, handleLogout }) => {

  Header.propTypes = {
    handleLogout: PropTypes.func.isRequired
  }

  return (
    <div className='header'>
      <h2 style={{ textAlign: 'center' }}>Blog List</h2>
      {user &&
        <div style={{ textAlign: 'center', justifyContent: 'full' }}>
          {user.username} ({user.name}) logged in <button onClick={handleLogout}>Log out</button>
        </div>
      }
    </div>
  )
}

export default Header