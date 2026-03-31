
import { useEffect, useState } from 'react';
import '../styles/pages/Login.scss';

export default function Login(props) {

  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);

  const [username, setUsername] = useState('');

  const buttonClick = (e) => {
    if (!username) return;
    setError('');
    if (window.mp) {
      window.mp.events.call('browser:login:tryLogin', username);
      setButtonDisabled(true);
      setInputDisabled(true);
    }
  }

  const showError = (message) => {
    setError(message);
    setButtonDisabled(false);
    setInputDisabled(false);
  }

  useEffect(() => {
    if (window.mp) {
      window.mp.events.add('browser:login:setState', setShowLogin);
      window.mp.events.add('browser:login:error', showError);

      return () => {
        window.mp.events.remove('browser:login:setState', setShowLogin);
        window.mp.events.remove('browser:login:error', showError);
      }
    }
  }, []);

  return (
    <div className={`loginWrapper ${showLogin ? '' : 'hidden'}`}>
      <div className="login">
        <h1>Connection</h1>
        <div className="content">
          <div className="input">
            <label htmlFor="discord">Discord Username</label>
            <input
              type="text"
              maxLength={25}
              placeholder="jeanmidu13"
              id="discord"
              disabled={inputDisabled}
              onChange={e => {
                if (e.target.value != '') setButtonDisabled(false);
                else setButtonDisabled(true);
                setUsername(e.target.value);
              }}
            />
          </div>
          { error &&
            <div className='error'>{error}</div>
          }
          <button disabled={buttonDisabled} onClick={buttonClick}>Connect</button>
        </div>
      </div>
    </div>
  )
}