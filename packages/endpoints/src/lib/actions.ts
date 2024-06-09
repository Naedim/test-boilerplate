import { SERVER_URL } from "./global"

export const ACTION_ENTRY = "/actions"

const ACTION_ENDPOINT_BASE = `${SERVER_URL}${ACTION_ENTRY}`

//endpoints
export const ACTION_ADD = "/add"
export const ACTION_ENDPOINT_ADD =  `${ACTION_ENDPOINT_BASE}${ACTION_ADD}`