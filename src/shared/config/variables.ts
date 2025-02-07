const getEnvVar = (key: string) => {
  return import.meta.env[key] || ''
}

export const ROOT =
  document.getElementById('react-root') || document.createElement('div')

// Firebase credentials
export const API_KEY = getEnvVar('VITE_APP_API_KEY')
export const AUTH_DOMAIN = getEnvVar('VITE_APP_AUTH_DOMAIN')
export const PROJECT_ID = getEnvVar('VITE_APP_PROJECT_ID')
export const STORAGE_BUCKET = getEnvVar('VITE_APP_STORAGE_BUCKET')
export const MESSAGING_SENDER_ID = getEnvVar('VITE_APP_MESSAGING_SENDER_ID')
export const APP_ID = getEnvVar('VITE_APP_APP_ID')
export const MEASUREMENT_ID = getEnvVar('VITE_APP_MEASUREMENT_ID')

// Base URL
export const BASE_URL = getEnvVar('VITE_APP_BASE_URL')

// Check is production
export const IS_PRODUCTION = import.meta.env.PROD

export const USER_PLACEHOLDER_IMAGE =
  'https://img.icons8.com/material-rounded/96/EBEBEB/user-male-circle.png'
