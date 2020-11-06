import * as TYPES from '@/redux/types'
import { save, get, remove } from '@/utils/storage'

// ====== state
let defaultState = {
  username: '',
  role: 2,
  userId: 0,
  github: null,
  email: null
}

const userInfo = get('userInfo')

if (userInfo) {
  defaultState = { ...defaultState, ...userInfo }
}

// console.log('%c defaultState', 'background: yellow', defaultState)
/**
 * UserReducer
 */
export default function UserReducer(state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case TYPES.USER_LOGIN:
      const { username, userId, role, github = null, token, email } = payload
      save('userInfo', { username, userId, role, github, token, email })
      return { ...state, username, userId, role, github, email }

    case TYPES.USER_LOGIN_OUT:
      remove('userInfo')
      return { ...state, username: '', userId: 0, role: 2, github: null, email: null}

    default:
      return state
  }
}
