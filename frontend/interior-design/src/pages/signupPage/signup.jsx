import './signup.css'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Cookies from 'js-cookie'
import Navbar from '../../components/navbar/Navbar'
import {Cloudinary} from '@cloudinary/url-gen';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const signupCountries = [
  { code: 'RO', label: 'Romania', phone: '40' },
  { code: 'MD', label: 'Moldova', phone: '373' },
  { code: 'BG', label: 'Bulgaria', phone: '359' },
  { code: 'HU', label: 'Hungary', phone: '36' },
  { code: 'UA', label: 'Ukraine', phone: '380' },
];

const countryCities = {
  Romania: [
    "Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța",
    "Craiova", "Brașov", "Galați", "Ploiești", "Oradea"
  ],
  Moldova: [
    "Chișinău", "Tiraspol", "Bălți", "Bender", "Rîbnița",
    "Cahul", "Ungheni", "Soroca", "Orhei", "Dubăsari"
  ],
  Bulgaria: [
    "Sofia", "Plovdiv", "Varna", "Burgas", "Ruse",
    "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"
  ],
  Hungary: [
    "Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs",
    "Győr", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely"
  ],
  Ukraine: [
    "Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk",
    "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Mariupol"
  ]
};


const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fieldsError, setFieldsError] = useState('');
  const [emailError, setEmailError] = useState(''); 
  const navigate = useNavigate()

  const checkIfPasswordsMatch = () => (password == passwordConf)

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowPasswordConf = () => setShowPasswordConf(!showPasswordConf);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNextStep = () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address!");
      setPasswordError('');
      setFieldsError('');
      return;
    }
    if(!checkIfPasswordsMatch()) {
      setPasswordError("Passwords do not match!")
      setFieldsError('');
      setEmailError('');
      return;
    }
    if(!email || !password || !passwordConf || !firstName || !lastName ) {
      setFieldsError("Please fill in all required fields!")
      setPasswordError('');
      setEmailError('');
      return;
    }
    setPasswordError('');
    setFieldsError('');
    setEmailError('');
    setError('');
    setCurrentStep(2);
  }

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setError('');
  }

  const handleSubmit = async () => {
    try{
      let imageUrl = '';
      if (picture) {
        const cloudData = new FormData();
        cloudData.append('file', picture);
        cloudData.append('upload_preset', 'image_upload'); 
        const cloudRes = await fetch('https://api.cloudinary.com/v1_1/dfjmhazol/image/upload', {
          method: 'POST',
          body: cloudData
        });
        const cloudJson = await cloudRes.json();
        imageUrl = cloudJson.secure_url;
      }
      const body = JSON.stringify({ 
        email: email, 
        password: password,
        name: firstName,
        surname: lastName,
        city: city,
        country: country,
        phone: phone,
        imageUrl: imageUrl
      });
      console.log('Signup body:', body);
      const response = await fetch('http://localhost:5029/api/v1/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      });

      let data = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        setError('Unexpected server response.');
        return;
      }
      if(!response.ok){
        const code = data.errors[0].code;
        if(code == "User.AlreadyExists"){
          setEmailError("Email is already registered by another user");
          setCurrentStep(1)
          return
        } if (code =="Password.Weak"){
          setPasswordError("Password must be at least 7 characters long and contain at least one number.");
          setCurrentStep(1)
        }else {
          setError("Incorrect credentials")
          return
        }
      }
      Cookies.set('userID', data.userId.value);
      Cookies.set('email', email, { expires: 1/1440 });
      navigate('/login', { state: { successMessage: 'User registered successfully!' } });
    } catch (err){
      console.log('Login failed: ', err.message)
    }
  }

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB.');
        setPicture(null);
        setPicturePreview(null);
        return;
      }
      setPicture(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPicturePreview(ev.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setPasswordError('');
    setFieldsError('');
    setEmailError('');
    setError('');
  };
  
  const handleCountryChange = (event, newValue) => {
    setCountry(newValue ? newValue.label : '');
    setPasswordError('');
    setFieldsError('');
    setError('');
  };

  const handleCityChange = (event, newValue) => {
    setCity(newValue || '');
    setPasswordError('');
    setFieldsError('');
    setError('');
  };

  return (
    <div className="container-signup">
      <Navbar page={"signup"} rightButtonMessage={"Already have an account? Sign in!"}/>
      <div className="signup-page">
        <div className="step-indicator-signup">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-title">Account Details</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-title">Profile Picture</span>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            <div className="main-title-signup">Create Your FurnishAI Account</div>
            <div className="input-wrapper-wrapper">
              <div className="general-info-sign-up-wrapper">
                <div className="general-info-sign-up">
                  <TextField 
                    id="first-name" 
                    label="First Name*" 
                    variant="standard" 
                    autoComplete="off"
                    type="text"
                    value={firstName}
                    onChange={handleFieldChange(setFirstName)}
                    InputLabelProps={{
                      style: { backgroundColor: 'var(--white)' },
                      shrink: true
                    }}
                    sx={{
                      mt: 2,
                      backgroundColor: 'var(--white)',
                      '& input': {
                        color: '#000',
                        backgroundColor: '#9ecf6dd',
                        WebkitBoxShadow: '0 0 0 1000px #9ecf6dd inset',
                        boxShadow: '0 0 0 1000px #9ecf6dd inset',
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
                      minWidth: '50%',
                    }}
                  />
                  <TextField 
                    id="last-name" 
                    label="Last Name*" 
                    variant="standard" 
                    type="text"
                    autocomplete="off"
                    value={lastName}
                    onChange={handleFieldChange(setLastName)}
                    InputLabelProps={{
                      style: { backgroundColor: 'var(--white)' },
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
                      minWidth: '50%',
                    }}
                  />
                  <TextField 
                  id="signup-email" 
                  label="Email*" 
                  variant="standard" 
                  value={email}
                  autoComplete="off"
                  onChange={handleFieldChange(setEmail)}
                  InputLabelProps={{
                    style: { backgroundColor: 'var(--white)' },
                    shrink: true
                  }}
                  sx={{
                    mt: 2,
                    backgroundColor: 'var(--white)',
                    '& input': {
                      color: '#000',
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
                      WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                      WebkitTextFillColor: '#000',
                    },
                    '& input:-moz-autofill': {
                      boxShadow: '0 0 0 1000px var(--white) inset',
                      color: '#000',
                    },
                  }}
                />
                {emailError && (
                    <div className="error-message-signup error-mail" style={{ marginTop: 10 }}>{emailError}</div>
                  )}
                <TextField 
                  id="signup-password" 
                  label="Password*" 
                  variant="standard" 
                  autoComplete="off"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleFieldChange(setPassword)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: '#485c11' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { backgroundColor: 'var(--white)'},
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
                      WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                      WebkitTextFillColor: '#000',
                    },
                    '& input:-moz-autofill': {
                      boxShadow: '0 0 0 1000px var(--white) inset',
                      color: '#000',
                    },
                  }}
                />
                <TextField 
                  id="signup-password-conf" 
                  label="Confirm Password*" 
                  variant="standard" 
                  autoComplete="off"
                  type={showPasswordConf ? 'text' : 'password'}
                  value={passwordConf}
                  onChange={handleFieldChange(setPasswordConf)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password confirmation visibility"
                          onClick={handleClickShowPasswordConf}
                          edge="end"
                          sx={{ color: '#485c11' }}
                        >
                          {showPasswordConf ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { backgroundColor: 'var(--white)'},
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
                      WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                      WebkitTextFillColor: '#000',
                    },
                    '& input:-moz-autofill': {
                      boxShadow: '0 0 0 1000px var(--white) inset',
                      color: '#000',
                    },
                  }}
                />
                {passwordError && (
                    <div className="error-message-signup" style={{ marginTop: 14 }}>{passwordError}</div>
                  )}
                <Autocomplete
                  id="country-select"
                  options={signupCountries}
                  autoComplete="off"
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  value={country ? signupCountries.find(c => c.label === country) : null}
                  onChange={handleCountryChange}
                  inputProps={{
                    autoComplete:'off',
                  }}
                  renderOption={(props, option) => (
                    <Box 
                      component="li" 
                      sx={{ 
                        '& > img': { mr: 2, flexShrink: 0, background: 'var(--white)' }, 
                        background: 'var(--white) !important',
                        borderTop: 'none',
                        borderBottom: 'none',
                      }} 
                      {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.label} ({option.code}) 
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country*"
                      autoComplete="new-country"
                      variant="standard"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-country',
                      }}
                      InputLabelProps={{
                        style: { backgroundColor: '' },
                        shrink: true,
                        autoComplete:"off"
                      }}
                      sx={{
                        mt: 2,
                        backgroundColor: 'var(--white)',
                        '& input': {
                          color: '#000',
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
                          WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                          WebkitTextFillColor: '#000',
                        },
                        '& input:-moz-autofill': {
                          boxShadow: '0 0 0 1000px var(--white) inset',
                          color: '#000',
                        },
                      }}
                    />
                  )}
                />
                <Autocomplete
                  id="city-select"
                  options={
                    country && countryCities[country]
                      ? countryCities[country]
                      : []
                  }
                  value={city}
                  autoComplete="off"
                  onChange={handleCityChange}
                  freeSolo
                  disabled={!country}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{
                        background: 'var(--white) !important', 
                        color: '#000',
                        borderTop: 'none',
                        borderBottom: 'none',
                      }}
                      {...props}
                    >
                      {option}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City*"
                      variant="standard"
                      autoComplete="new-city"
                      inputProps = {{
                        ...params.inputProps,
                        autoComplete: 'new-city',
                      }}
                      InputLabelProps={{
                        style: { backgroundColor: 'var(--white)'},
                        shrink: true
                      }}
                      sx={{
                        mt: 2,
                        backgroundColor: 'var(--white)',
                        '& input': {
                          color: '#000',
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
                          WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                          WebkitTextFillColor: '#000',
                        },
                        '& input:-moz-autofill': {
                          boxShadow: '0 0 0 1000px var(--white) inset',
                          color: '#000',
                        },
                      }}
                    />
                  )}
                />
                <TextField 
                  id="signup-phone" 
                  label="Phone Number*" 
                  variant="standard" 
                  value={phone}
                  autoComplete="off"
                  onChange={handleFieldChange(setPhone)}
                  InputLabelProps={{
                    style: { backgroundColor: 'var(--white)' },
                    shrink: true
                  }}
                  sx={{
                    mt: 2,
                    backgroundColor: 'var(--white)',
                    '& input': {
                      color: '#000',
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
                      WebkitBoxShadow: '0 0 0 1000px var(--white) inset',
                      WebkitTextFillColor: '#000',
                    },
                    '& input:-moz-autofill': {
                      boxShadow: '0 0 0 1000px var(--white) inset',
                      color: '#000',
                    },
                  }}
                />
                </div>
                
              
              </div>
                {fieldsError && <div className="error-message-signup" style={{ marginTop: 12 }}>{fieldsError}</div>}
                
                <div className="submit-button-signup-wrapper">
                  <button 
                    className="submit-button-signup" 
                    onClick={handleNextStep}
                    disabled={!email || !password || !passwordConf || !firstName || !lastName}
                    style={{
                      opacity: (!email || !password || !passwordConf || !firstName || !lastName) ? 0.5 : 1,
                      pointerEvents: (!email || !password || !passwordConf || !firstName || !lastName) ? 'none' : 'auto'
                    }}
                  >
                      Next: Choose Profile Picture
                  </button>

                </div>
              
            </div>

          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="main-title-signup">Choose Your Profile Picture</div>
            <div className="step2-description">
              Add a profile picture to personalize your account (optional)
            </div>
            
            <div className="picture-upload-section">
              {picturePreview ? (
                <div className="signup-image-preview-wrapper">
                  <img
                    src={picturePreview}
                    alt="Selected preview"
                    className="signup-image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => { setPicture(null); setPicturePreview(null); }}
                    className="signup-image-remove-btn"
                    aria-label="Remove selected image"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="picture-upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <label htmlFor="signup-file-upload" className="signup-file-label">
                    <span className="signup-file-label-text">Choose Profile Picture</span>
                    <input
                      id="signup-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                      className="signup-file-input"
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p className="upload-hint">JPG, PNG up to 5MB</p>
                </div>
              )}
              
              {error && <div className="error-message-signup file-size">{error}</div>}
            </div>

            <div className="step2-buttons">
              <button 
                className="submit-button back-button-signup no-min-width" 
                onClick={handlePreviousStep}
              >
                ← Back
              </button>
              
              <button 
                className="submit-button no-min-width" 
                onClick={handleSubmit}
              >
                Complete Registration
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Signup
