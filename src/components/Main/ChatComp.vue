<template>
    <div class="container">
        <div class="chanel-box">
            <button @click="ChatCreatorToggle()">new chat</button>
            <div v-if="chatCreator">
                <input type="text" v-model="NewChatName"/>
                <button @click="ChatCreate()">+</button>
            </div>
            <button @click="ChatJoinerToggle()">join</button>
            <div v-if="chatJoiner">
                <input type="text" v-model="JoinChatName"/>
                <button @click="ChatJoin(JoinChatName)">join</button>
            </div>
            <ul>
                <li v-for="(cha, index) in chats" v-bind:key="index" @click="MsgsLoad(cha)">
                    <div>
                        ({{index + 1}}) {{cha.chat_name}}
                    </div>
                    <div @click="ChatDel(cha.id)"><span class="material-icons">delete</span></div>
                </li>
            </ul>
        </div>
        <div>
            <div class="chat-content" v-if="chatPanel.visible">

                <div v-if="chatPanel.chatContent.length === 0" style="text-align: center; margin: 10vh 0;">no msg yet
                </div>
                <div v-else>
                    <div v-for="(msg, index) in chatPanel.chatContent" v-bind:key="index" class="msg-box">
                        <div class="msg-box-name">
                            {{msg.user_name}}:
                        </div>
                        <div class="msg-box-content">
                            {{msg.content}}
                        </div>
                        <div class="msgs-btns" v-if="propsuserid === msg.user_id">
                            <label class="btnUpdt" @click="UpdateToggle(msg)">
                                <span class="material-icons">edit</span>
                            </label>
                            <label class="btnDel" @click="MsgDelete(msg.id)">
                                <span class="material-icons">delete</span>
                            </label>
                        </div>

                    </div>
                </div>

                <div class="chatbox">
                    <form v-if="!updateToggle">
                        <textarea ref="txtarea" @input="reSize()" v-model="inputtxt"
                                  @keypress.enter.exact.prevent="MsgSend(inputtxt)"
                                  @keydown.enter.shift.exact.prevent="inputtxt += '\n'"/>
                        <button @click.prevent="MsgSend(inputtxt)">send</button>
                    </form>
                    <form v-if="updateToggle">
                        <textarea ref="txtarea" @input="reSize()" v-model="updtInputtxt"
                                  @keypress.enter.exact.prevent="MsgUpdate(msgUpdateObj, updtInputtxt)"
                                  @keydown.enter.shift.exact.prevent="updtInputtxt += '\n'"/>
                        <button @click.prevent="MsgUpdate(msgUpdateObj, updtInputtxt)">update</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {delet, get, post, put} from "/src/api/helpers";
    import 'material-icons/iconfont/material-icons.css'

    export default {
        name: "ChatComp",
        props: {
            propsuserid: String,
        },
        data: () => ({
            chatCreator: false,
            chatJoiner: false,
            NewChatName: "",
            JoinChatName: "",
            chats: [],
            chatPanel: {
                visible: false,
                currentChat: {},
                chatContent: [{
                    id: 0,
                    content: "",
                    user_id: "",
                    chat_id: "",
                    user_name: "",
                }],
            },
            inputtxt: "",
            connection: null,
            updateToggle: false,
            msgUpdateObj: {
                content: "",
            },
            updtInputtxt: "",
        }),
        methods: {
            async ChatListLoad() {
                const res = await get("/chat/all_by_user")
                this.chats = await res
            },
            async ChatCreate() {
                const res = await post("/chat/create", {
                    "chat_name": this.NewChatName
                })
                this.ChatCreatorToggle()
                this.ChatListLoad()
            },
            ChatCreatorToggle() {
                this.chatCreator = !this.chatCreator
                this.chatJoiner = false
            },
            ChatJoinerToggle() {
                this.chatJoiner = !this.chatJoiner
                this.chatCreator = false
            },
            async MsgsLoad(elem) {
                const res = await get(`/msg/get/${elem.id}`)
                this.chatPanel.currentChat = elem
                this.chatPanel.chatContent = res
                this.chatPanel.visible = true
                this.created()
            },
            async MsgDelete(msgid) {
                const res = await delet(`/msg/delete/${msgid}`)
            },
            async ChatJoin(str) {
                const res = await put("/chat/join", {
                    chat_name: str
                })
                this.ChatListLoad()
                this.ChatJoinerToggle()
            },
            async ChatDel(id){
                const res =  await delet(`/chatdelete/${id}`)
            },
            async MsgSend(txt) {
                const res = post("/msg/create", {
                    "content": txt,
                    "chat_id": this.chatPanel.currentChat.id,
                })
                this.inputtxt = ""
            },
            reSize() {
                let element = this.$refs["txtarea"];
                element.style.height = "18px";
                element.style.height = element.scrollHeight + "px";
            },
            UpdateToggle(obj) {
                this.updateToggle = !this.updateToggle
                this.msgUpdateObj = obj
                this.updtInputtxt = obj.content
            },
            async MsgUpdate(obj, txt) {
                const res = put(`/msg/update`, {
                    "id": obj.id,
                    "content": txt,
                    "user_id": obj.user_id,
                    "chat_id": this.chatPanel.currentChat.id,
                    "user_name": obj.user_name,
                })

                this.updateToggle = !this.updateToggle
            }
        },

        mounted() {
            this.ChatListLoad()
            this.$root.$on('new_message', msg => {


                if (msg.event == "msgcreate"){
                    let content = JSON.parse(msg.data)
                    this.chatPanel.chatContent.push(content)
                }
                if (msg.event == "msgdelete"){
                    let content = JSON.parse(msg.data)
                    this.chatPanel.chatContent = this.chatPanel.chatContent.filter((elem) => (elem.id !== content.id))
                }
                if (msg.event == "msgupdate"){
                    let content = JSON.parse(msg.data)


                    this.chatPanel.chatContent.map((elem, index) => {
                        if (elem.id == content.id){
                            this.chatPanel.chatContent.splice(index,1,content)
                        }
                })
                }
                if (msg.event == "chdelete"){
                    this.ChatListLoad()
                }
            })
        },
    }
</script>

<style scoped>
    button {
        margin-left: 1rem;
        color: white;
        background-color: #171614;
        border-radius: 5px;
        border: 0;
    }

    .container {
        margin: 0 10vw;
        background-color: #C6DEA6;
        display: grid;
        grid-template-columns: 20% 80%;
        min-height: 90vh;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .chanel-box {
        border-right: 2px solid #426A5A;
        padding-top: 1rem;
    }

    .chanel-box input {
        max-width: 10vw;
    }

    .chanel-box ul {
        list-style: none;
        padding: 0;
    }

    .chanel-box li {
        text-align: left;
        cursor: pointer;
        margin-top: 1vh;
        display: flex;
        justify-content: space-between;
    }

    .chat-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
    }

    .chat-content form {
        margin-left: 5vw;
    }

    .chat-content textarea {
        min-width: 45vw;
        min-height: 10vh;
        resize: none;
        overflow: hidden;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .msg-box {
        display: flex;
        flex-direction: row;
        white-space: pre-line;
        margin: 2vh 0;
        border-top: 2px solid #426A5A;

    }

    .msg-box-content {
        margin-left: 1vw;
    }

    .msgs-btns {
        margin-left: auto;
    }

    .btnDel, .btnUpdt {
        cursor: pointer;
    }
</style>