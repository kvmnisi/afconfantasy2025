// auth.js - Authentication Logic
import { supabase } from './supabase.js'

let currentUser = null

// Initialize auth state
async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
        // User is already logged in, redirect to app
        window.location.href = '/app'
        return
    }
    
    // Show login form
    showLoading(false)
}

// Switch between login and signup forms
function switchToSignup() {
    document.getElementById('login-box').style.display = 'none'
    document.getElementById('signup-box').style.display = 'block'
}

function switchToLogin() {
    document.getElementById('signup-box').style.display = 'none'
    document.getElementById('login-box').style.display = 'block'
}

// Show/hide loading
function showLoading(show = true) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none'
}

// Sign in function
async function signIn() {
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    
    if (!email || !password) {
        alert('Please enter both email and password')
        return
    }
    
    showLoading(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    
    showLoading(false)
    
    if (error) {
        console.error('Sign in error:', error)
        alert(`Sign in failed: ${error.message}`)
        return
    }
    
    // Success - redirect to app
    window.location.href = '/app'
}

// Sign up function
async function signUp() {
    const name = document.getElementById('signup-name').value.trim()
    const email = document.getElementById('signup-email').value.trim()
    const password = document.getElementById('signup-password').value.trim()
    const confirm = document.getElementById('signup-confirm').value.trim()
    
    // Validation
    if (!name || !email || !password || !confirm) {
        alert('Please fill in all fields')
        return
    }
    
    if (password !== confirm) {
        alert('Passwords do not match')
        return
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters')
        return
    }
    
    showLoading(true)
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    })
    
    showLoading(false)
    
    if (error) {
        console.error('Sign up error:', error)
        alert(`Sign up failed: ${error.message}`)
        return
    }
    
    alert('Account created successfully! Please check your email for confirmation, then sign in.')
    switchToLogin()
    
    // Clear form
    document.getElementById('signup-name').value = ''
    document.getElementById('signup-email').value = ''
    document.getElementById('signup-password').value = ''
    document.getElementById('signup-confirm').value = ''
}

// Sign out function (for app.html)
async function signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        console.error('Sign out error:', error)
        alert('Failed to sign out')
        return
    }
    
    // Redirect to home page
    window.location.href = 'index.html'
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session)
    
    if (event === 'SIGNED_IN') {
        // User signed in, redirect to app
        window.location.href = 'app.html'
    } else if (event === 'SIGNED_OUT') {
        // User signed out, stay on index.html
        // (already there or will be redirected)
    }
})

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initAuth)

// Make functions available globally
window.switchToSignup = switchToSignup
window.switchToLogin = switchToLogin
window.signIn = signIn
window.signUp = signUp
window.signOut = signOut