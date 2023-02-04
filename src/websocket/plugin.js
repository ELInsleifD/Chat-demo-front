import { MegaWebsocket } from "./websocket"

export default {
    install(app){
        app.prototype.$socket = MegaWebsocket
    }
}