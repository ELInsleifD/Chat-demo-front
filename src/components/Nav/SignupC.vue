<template>
    <form>
        <form class="form" @submit.prevent="onSubmit()">
            <label for="nameref">User name</label>
            <input type="text" id="nameref" v-model="name"/>
            <label for="pasref">Password</label>
            <input type="text" id="pasref" v-model="pas"/>
            <button>create</button>
        </form>
    </form>
</template>

<script>
    import {post} from "/src/api/helpers";

    export default {
        name: "SignupC",

        data: () => ({
            name: this.name,
            pas: this.pas
        }),
        methods: {
            async onSubmit() {
                const res = await post("/user/register", {
                    name: this.name,
                    secret: this.pas,
                })
                if (res.error) {
                    alert("error")
                } else {
                    this.$emit("SignUpClicked")
                }
            }
        }
    }
</script>

<style scoped>
    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 20px 0;
    }

    .form button {
        color: white;
        background-color: #171614;
        border-radius: 5px;
        border: 0;
    }
</style>