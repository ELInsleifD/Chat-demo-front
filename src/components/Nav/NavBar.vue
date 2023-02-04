<template>
    <div class="conainer">
        <div class="nav-container">
            <div class="logo">logo</div>
            <div class="logers">
                <button v-if="!authorized" @click="signupOpen()">SIGNUP</button>
                <button v-if="!authorized" @click="loginOpen()" @loadMe="loadMe">LOGIN</button>
                <button v-if="authorized" @click="loginClear()">LOGOUT</button>
            </div>
        </div>
        <div class="form-container" v-if="!authorized">
            <LoginC v-if="loginToggle && !authorized" @loadMe="loadMe"/>
            <SignupC v-if="signupToggle && !authorized" @SignUpClicked="signupOpen"/>
        </div>
    </div>
</template>

<script>
    import SignupC from "./SignupC";
    import LoginC from "./LoginC";

    export default {
        name: "NavBar",
        components: {
            SignupC,
            LoginC,
        },
        props: [
            "authorized",
        ],
        data: () => {
            return {
                loginToggle: false,
                signupToggle: false
            }
        },
        methods: {
            loginOpen() {
                this.loginToggle = !this.loginToggle
                this.signupToggle = false
            },
            loginClear() {
                localStorage.clear()
                this.loginToggle = false
                this.signupToggle = false
                this.$emit("logoutHandler")
            },
            signupOpen() {
                this.signupToggle = !this.signupToggle
                this.loginToggle = false
            },
            loadMe() {
                this.$emit("loadMe")
            },
        },

    }
</script>

<style scoped>
    .nav-container {
        background-color: #C6DEA6;
        display: flex;
        justify-content: space-between;
        padding: 5vh 10vw;
    }

    .logers button {
        margin-left: 2vw;
        font-weight: 800;
        color: white;
        background-color: #171614;
        border-radius: 5px;
        border: 0;
    }

    .form-container {
        background-color: #C6DEA6;
        margin: 0 30vw;
        margin-top: 20vh;
        border-radius: 5px;
    }
</style>