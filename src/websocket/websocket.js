

export const MegaWebsocket = {

    authorised: false,
    created: false,
    connection: null,
    message : null,
    onMessage: null,

    CreateConnection : function(propsuserid) {
        if (!this.created){
    this.connection = new WebSocket(`ws://localhost:4000/ws/${propsuserid}`)
            this.created = true

            this.connection.onmessage = (event)=>{
                if (this.onMessage) {
                    this.onMessage(JSON.parse(event.data))
                }
            }
    }},
}