import './login.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Navbar from '../../components/navbar/Navbar'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [showSendLink, setShowSendLink] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    const emailCookie = Cookies.get('email');
    if (emailCookie) {
      setEmail(emailCookie);
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    try{
      console.log('handle submit');
      const response = await fetch('http://localhost:5029/api/v1/Auth/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          password:password })
      })
      const data = await response.json()

      if(!response.ok){
        const code = data.errors[0].code;
        if(code == "User.InvalidCredentials"){
          setError("Password is wrong")
          return
        } else if(code == "User.NotFound"){
          setError("There is no user registered with this email")
          return
        } else {
          setError("Incorrect credentials")
          return
        }
      }

      const token = data.token.value 
      const payload = JSON.parse(atob(token.split('.')[1]))
  
      Cookies.set('token', token)
      Cookies.set('userID', payload.nameid);
      Cookies.set('email', email);
      

      navigate('/home', { state: { successMessage: 'Logged in successfully!' } });

    } catch (err){
      console.log('Login failed: ', err.message)
    }
  }

  const handleForgotPassword = async () => {
    console.log('ajunge ')
    setForgotMessage('')
    setForgotError('')
    if (!email) {
      setForgotError('Please enter your email above first.')
      return
    }
    try {
      const response = await fetch('http://localhost:5029/api/v1/Auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!response.ok) {
        const data = await response.json()
        setForgotError(data.title || data.message || 'Could not send reset link.')
        return
      }
      setForgotMessage('If that email exists, a reset link has been sent.')
    } catch (err) {
      setForgotError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="container-login">
      <Navbar page={"login"} rightButtonMessage={"Sign Up for an account here!"}/>
      
      <div className="login-page">
        <div className="main-title-login">Login to you FurnishAI account!</div>
          <form className="input-wrapper-login" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <TextField 
              id="standard-basic" 
              label="Email" 
              variant="standard" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputLabelProps={{
                style: { backgroundColor: 'var(--white)', padding: '0 4px' },
                shrink: true
              }}
              sx={{
                backgroundColor: 'var(--white)',
                '& input': {
                  color: '#000',
                  WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                  boxShadow: '0 0 0 1000px var(--white) inset',
                  WebkitTextFillColor: '#000',
                  backgroundColor: '#ecf6dd',
                },
                '& .MuiInputBase-root': {
                  backgroundColor: '#ecf6dd',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#485c11',
                },
                '& .MuiInputLabel-root.Mui-focused':{
                  color: '#485c11',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                  WebkitTextFillColor: '#000',
                },
                '& input:-moz-autofill': {
                  boxShadow: '0 0 0 1000px #9bab9b inset',
                  color: '#000',
                },
              }}
            />
            <TextField 
              id="standard-password" 
              label="Password" 
              variant="standard" 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputLabelProps={{
                style: { backgroundColor: 'var(--white', padding: '0 4px' },
                shrink: true
              }}
              sx={{
                mt: 2,
                backgroundColor: 'var(--white)',
                '& input': {
                  color: '#000',
                  backgroundColor: 'var(--white)',
                  WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                  boxShadow: '0 0 0 1000px var(--white) inset',
                  WebkitTextFillColor: '#000',
                },
                '& .MuiInputBase-root': {
                  backgroundColor: 'var(--white)',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#485c11',
                },
                '& .MuiInputLabel-root.Mui-focused':{
                  color: '#485c11',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #9bab9b inset',
                  WebkitTextFillColor: '#000',
                },
                '& input:-moz-autofill': {
                  boxShadow: '0 0 0 1000px #9bab9b inset',
                  color: '#000',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <div className="error-message-login">{error}</div>}
            <button 
              className="submit-button-login" 
              type="submit"
              disabled={!email || !password}
              style={{
                opacity: (!email || !password) ? 0.5 : 1,
                pointerEvents: (!email || !password) ? 'none' : 'auto'
              }}
            >
                Log In
            </button>
          </form>

        <div
          onClick={() => {setShowSendLink(!showSendLink);}} 
          className="end-of-login">
          Forgot password?
        </div>
        {showSendLink && (
          <button
            type="button"
            style={{ mt: '30px', background: 'none', border: 'none', color: '#485c11', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            onClick={handleForgotPassword}
          >
              Send reset link?
          </button>
        )}
        {forgotMessage && <div className="success-popup">{forgotMessage}</div>}
        {forgotError && <div className="error-message-login">{forgotError}</div>}
        {successMessage && (
          <div className="success-popup">{successMessage}</div>
        )}
      </div>
    </div>
  )
}

export default Login
