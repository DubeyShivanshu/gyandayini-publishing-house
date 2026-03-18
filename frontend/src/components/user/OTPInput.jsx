// import { useState, useRef } from 'react'
// import api from '../../utils/api.js'
// import toast from 'react-hot-toast'

// export default function EmailOTPInput({ email, onVerified }) {
//   const [otp, setOtp] = useState(['', '', '', ''])
//   const [sending, setSending] = useState(false)
//   const [verifying, setVerifying] = useState(false)
//   const [sent, setSent] = useState(false)
//   const [countdown, setCountdown] = useState(0)
//   const inputs = useRef([])
//   const timerRef = useRef(null)

//   const handleChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return
//     const newOtp = [...otp]
//     newOtp[index] = value
//     setOtp(newOtp)
//     if (value && index < 3) inputs.current[index + 1]?.focus()
//   }

//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputs.current[index - 1]?.focus()
//     }
//   }

//   const startCountdown = () => {
//     setCountdown(60)
//     clearInterval(timerRef.current)
//     timerRef.current = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) { clearInterval(timerRef.current); return 0 }
//         return prev - 1
//       })
//     }, 1000)
//   }

//   const handleSend = async () => {
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       toast.error('Enter a valid email address first')
//       return
//     }
//     setSending(true)
//     try {
//       const res = await api.post('/otp/send-email', { email })
//       setSent(true)
//       startCountdown()
//       toast.success('OTP sent to your email!')
//       if (res.data.otp) toast(`Dev OTP: ${res.data.otp}`, { icon: '🔑', duration: 10000 })
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to send OTP')
//     } finally {
//       setSending(false)
//     }
//   }

//   const handleVerify = async () => {
//     const otpStr = otp.join('')
//     if (otpStr.length !== 4) { toast.error('Enter all 4 digits'); return }
//     setVerifying(true)
//     try {
//       await api.post('/otp/verify-email', { email, otp: otpStr })
//       toast.success('Email verified successfully!')
//       onVerified()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Invalid OTP. Try again.')
//       setOtp(['', '', '', ''])
//       inputs.current[0]?.focus()
//     } finally {
//       setVerifying(false)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       {!sent ? (
//         <div className="space-y-2">
//           <p className="text-sm text-gray-600 font-body">
//             We'll send a 4-digit OTP to <strong>{email || 'your email'}</strong>
//           </p>
//           <button type="button" onClick={handleSend} disabled={sending} className="btn-secondary w-full flex items-center justify-center gap-2">
//             {sending ? <><div className="loader w-4 h-4 border-2" /> Sending...</> : '📧 Send OTP to Email'}
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <p className="text-sm text-gray-600 font-body">
//             Enter the 4-digit OTP sent to <strong>{email}</strong>
//           </p>
//           <div className="flex gap-3 justify-center">
//             {otp.map((digit, i) => (
//               <input
//                 key={i}
//                 ref={el => inputs.current[i] = el}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={e => handleChange(i, e.target.value)}
//                 onKeyDown={e => handleKeyDown(i, e)}
//                 className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
//               />
//             ))}
//           </div>
//           <div className="flex gap-3">
//             <button type="button" onClick={handleVerify} disabled={verifying} className="btn-primary flex-1 flex items-center justify-center gap-2">
//               {verifying ? <><div className="loader w-4 h-4 border-2" /> Verifying...</> : '✅ Verify OTP'}
//             </button>
//             <button type="button" onClick={handleSend} disabled={sending || countdown > 0} className="btn-outline text-sm">
//               {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
//             </button>
//           </div>
//           <p className="text-xs text-gray-400 font-body text-center">OTP expires in 5 minutes. Check spam/junk if not received.</p>
//         </div>
//       )}
//     </div>
//   )
// }


export default function EmailOTPInput() {
  return null
}