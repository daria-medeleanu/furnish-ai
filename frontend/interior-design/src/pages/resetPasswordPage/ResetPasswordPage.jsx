import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import './resetPassword.css'

const ResetPasswordPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!password || !confirmPassword) {
      setError('Please fill in both fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!token) {
      setError('Invalid or missing token.')
      return
    }
    if (password.length < 7 || !/\d/.test(password)) {
      setError('Password must be at least 7 characters long and contain at least one number.')
      return
    }

    try {
      const response = await fetch('http://localhost:5029/api/v1/Auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token,
            newPassword: password,
        })
      })

      if (!response.ok) {
        const data = await response.json()

        if (data.code === 'Password.Weak' || data.title?.includes('Password must be at least 7 characters')) {
          setError('Password must be at least 7 characters long and contain at least one number.')
          return
        }

        setError(data.title || data.message || 'Reset failed.')
        return
      }

      setSuccess('Password reset successfully.')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="reset-pass-wrapper">
      <Navbar page="signup" rightButtonMessage={"Go to login"}/>
      <div className="reset-password-container" >
        <h2 style={{ marginBottom: 24 }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="new-password" style={{ display: 'block', marginBottom: 6 }}>New Password</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          {error && <div style={{ color: '#b00020', marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ color: '#388e3c', marginBottom: 12 }}>{success}</div>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 10,
              background: '#485c11',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage