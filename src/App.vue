<template>
    <div id="app">
        <NavBar @loadMe="loadMe" @logoutHandler="logout" :authorized="authorized"/>
        <ChatComp v-if="authorized" :propsuserid="user.id"/>
    </div>
</template>

<script>
    import ChatComp from "../src/components/Main/ChatComp"
    import {get} from "./api/helpers";
    import NavBar from "./components/Nav/NavBar"

    export default {
        name: 'App',
        components: {
            NavBar,
            ChatComp,
        },

        data: function () {
            return {
                user: {
                    id: "",
                    name: "",
                },
                authorized: false,
            }
        },

        methods: {
            async loadMe() {
                const res = await get("/user/me")
                if (!res.error) {
                    this.authorized = !this.authorized
                }

                this.user = res
                console.log(JSON.parse(JSON.stringify(this.user)))
                this.$socket.onMessage = msg => {
                    this.$root.$emit('new_message', msg)
                }
                if (this.user.id) {
                    this.$socket.CreateConnection(this.user.id)
                }
            },

            logout() {
                this.authorized = false
            },
        },
        async beforeMount() {
            await this.loadMe()

        }

    }
</script>

<style>
    body {
        margin: 0;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        position: relative;
        min-height: 100vh;
    }
</style>
