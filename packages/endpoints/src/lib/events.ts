import { SERVER_URL } from "./global"

export const EVENTS_ENTRY = "/events"

const EVENT_ENDPOINT_BASE = `${SERVER_URL}${EVENTS_ENTRY}`

//endpoints
export const EVENTS_ACTIONS = "/actions"
export const EVENT_ENDPOINT_ACTION =  `${EVENT_ENDPOINT_BASE}${EVENTS_ACTIONS}`

