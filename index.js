axios.defaults.headers.post[ 'Access-Control-Allow-Origin' ] = '*';

Vue.component('todo-list', {
    props: [ 'user' ],
    template:
        `<ul>
            <todo-item
                v-for="todo in user.todo_list"
                v-bind:todo="todo"
                v-bind:key="todo.id"></todo-item>
        </ul>`,
    mounted() {

    },
    methods: {}
});

Vue.component('todo-item', {
    props: [ 'todo' ],
    data() {
        return {
            class: ""
        }
    },
    template:
        `<li @click="markDone">
            <input type="checkbox" :checked="todo.is_done">
            <span :class="this.class">{{this.todo.name}}</span>
        </li>`,
    mounted() {
        this.setStyle();
    },
    methods: {
        markDone: function () {
            this.todo.is_done = !this.todo.is_done;
            // console.log("#" + this.todo._id + ", " + this.todo.name + ", done? " + this.todo.is_done);

            axios.post('http://127.0.0.1:3000/api/task/' + this.todo._id + '/update', this.todo)
                .then(response => {
                })
                .catch(err => console.log(err));
            this.setStyle();
        },
        setStyle: function () {
            if (this.todo.is_done) {
                this.class = "done";
            } else {
                this.class = "inprogress";
            }
        }
    }
});

var app2 = new Vue({
    el: '#app-2',
    data: {
        new_todo: "",
        user: {
            username: "soulevans",
            password: "hidden",
            todo_list: [
                // { id: 0, name: "fuck a", is_done: true },
                // { id: 1, name: "fuck as", is_done: false },
                // { id: 2, name: "fuck asd", is_done: false },
                // { id: 3, name: "fuck asdf", is_done: false }
            ]
        }
    },
    mounted() {
        this.refresh();
    },
    methods: {
        refresh: function () {
            this.user.todo_list = [];
            axios.get('http://127.0.0.1:3000/api/tasks')
                .then(res => {
                    res.data.list.forEach(task => this.user.todo_list.push(task));
                })
                .catch(err => console.log(err))
        },
        addTodo: async function () {
            if (this.new_todo) {
                await axios
                    .post('http://127.0.0.1:3000/api/task/new', {
                        name: this.new_todo,
                        is_done: false
                    })
                    .then(response => console.log(response.data))
                    .catch(err => console.log(err));
                this.refresh();
            }
        }
    }
});

var app3 = new Vue({
    el: '#app-3',
    data: {
        see: true,
        msg: "Now you can see me!",
        no: "Now you can't!"
    },
    methods: {
        show: function () {
            this.see = !this.see;
        }
    }
});

var app4 = new Vue({
    el: '#box',
    data: {
        color1: '#22d686',
        color2: '#24d3d3',
        color3: '#22d686',
        color4: '#24d3d3',
        max_rot: 20,
        way: true,
        pos: 0,
        scale: 100,
        speed: 100,
        step: 10,
        angle: 90,
        rot: 0,
        style: 'background: linear-gradient(to right, rgb(78, 216, 255) -200%, rgb(91, 255, 54) -100%, rgb(78, 216, 255) 0%, rgb(91, 255, 54) 100%)'
    },
    mounted() {
        this.setStyle();
        setTimeout(() => this.moveR(), this.speed);
    },
    methods: {
        moveR: function () {
            if (this.pos < 2 * this.scale) this.pos += parseInt(this.step);
            else this.pos = 0;

            if (this.way) this.rot += 1;
            else this.rot -= 1;

            if (this.rot >= this.max_rot) this.way = false;
            if (this.rot <= -this.max_rot) this.way = true;

            this.setStyle();
            setTimeout(() => this.moveR(), this.speed);
        },
        setStyle: function () {
            let p1 = this.pos - 2 * this.scale;
            let p2 = this.pos - this.scale;
            let p3 = this.pos;
            let p4 = this.pos + this.scale;
            this.style = "background: linear-gradient(" + (this.angle + this.rot) + "deg, " + this.color1 + " " + p1 +
                "%, " + this.color2 + " " + p2 + "%, " + this.color3 + " " + p3 + "%, " + this.color4 + " " + p4 + "%)";
        }
    }
});