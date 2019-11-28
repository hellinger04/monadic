/* This component renders a login page for the user. The user can enter their username and password and attempt to login
   using the "Login" button. Once this button is clicked, the username and password input by the user are sent to the
   Server, where their authenticity is checked. If the credentials are valid, the user can proceed to view content,
   otherwise the user must try to enter valid credentials again.
 */
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateLogin(response) {
        if (response.status === 401) {
            alert("Invalid username or password. Please try again")
        } else if (response.status === 200) {
            this.props.changePage("content", 0, 0)
        }
    }

    handleSubmit(event) {
        // the form lets me submit when empty, this needs to be fixed
        event.preventDefault();
        const data = new FormData(event.target);

        fetch('/users/login', {
            method: 'POST',
            body: data,
        }).then((function(response) { this.validateLogin(response) }).bind(this));
    }

    render() {
        return (
            <div className={"regMain"}>
                <p><br></br></p>
                <span className={"logo"}>M O N A D I C</span>
                <p><br></br></p>
                <span className={"asciiLite"}>Welcome back! Please login below.</span>
                <p></p>

                <form onSubmit={this.handleSubmit} className={"rForm"}>
                    <p></p>
                    <span className={"asciiLite"}>Username</span>
                    <br></br>
                    <label>
                        <input type="text" name="username" placeholder={"Username"}/>
                    </label>
                    <p><br></br></p>

                    <span className={"asciiLite"}>Password</span>
                    <br></br>
                    <label>
                        <input type="password" name="password" placeholder={"Password"}/>
                    </label>

                    <p></p>
                    <span id="errorSpan" style={{color:"red"}}/>
                    <p></p>
                    <input type="submit" value="Login" />
                    <p></p>
                    <button onClick={() => {this.props.changePage("register", 0, 0)} }>No account? Register now!</button>
                </form>
            </div>
        );
    }
}

/* This component is the default component that's rendered when navigating to the Monadic website. It allows users to
   enter a desired username and password in order to create an account. The component will instantly check to ensure
   that the username entered by the user is at least one character long, and that the password is at least eight
   characters long. When the user clicks the "Register" button, the component also queries the server to check whether
   the username already exists. If it does, the program alerts the user that the username is already taken.
 */
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {changes: 0};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changedUsername = false;
        this.changedPassword = false;
        this.invalidUsername = true;
        this.invalidPassword = true;
        this.isMessage = false;
    }

    usernameExists(response) {
        if (response.status === 409) {
            alert("That username already exists. Please try another username.")
        } else if (response.status === 201) {
            this.props.changePage("content", 0, 0)
        }
    }

    handleChange(event) {
        if (event.target.getAttribute('name') === "username" && event.target.value.length < 1) {
            this.changedUsername = true;
            this.invalidUsername = true;
        } else if (event.target.getAttribute('name') === "username") {
            this.changedUsername = true;
            this.invalidUsername = false;
        }

        if (event.target.getAttribute('name') === "password" && event.target.value.length < 8) {
            this.changedPassword = true;
            this.invalidPassword = true;
        } else if (event.target.getAttribute('name') === "password") {
            this.changedPassword = true;
            this.invalidPassword = false;
        }

        let message = "";

        if (this.changedUsername && this.invalidUsername) {
            document.getElementById("registerButton").disabled = true;
            this.isMessage = true;
            message = message + "Username cannot be empty. ";
        }

        if (this.changedPassword && this.invalidPassword) {
            document.getElementById("registerButton").disabled = true;
            this.isMessage = true;
            message = message + "Password must be 8 characters long.";
        }

        //if message length is zero, don't display anything
        if (message.length === 0) {
            this.isMessage = false;
        }

        //if username and password are valid, enable 'register' button
        if (!(this.invalidUsername || this.invalidPassword)) {
            document.getElementById("registerButton").disabled = false;
        }

        // document.getElementById("errorSpan").style.property = new style
        // add <br> to inner HTML and remove one <br> from below the <span>
        document.getElementById("errorSpan").innerHTML = message;

        this.setState({changes: 1});
    }

    handleSubmit(event) {
        // TODO the form lets me submit when empty, this needs to be fixed
        // get target's username value and then check to ensure length > 0
        event.preventDefault();
        const data = new FormData(event.target);

        fetch('/users', {
            method: 'POST',
            body: data,
        }).then((function(exists) { this.usernameExists(exists) }).bind(this));
    }

    render() {
        return (
            <div className="regMain">
                <p><br/></p>
                <span className={"logo"}>M O N A D I C</span>
                <p><br/></p>
                <span className={"asciiLite"}>Register now! It's quick and easy.</span>

                <br/>
                <br/>
                <br/>

                <form onChange={this.handleChange} onSubmit={this.handleSubmit} className={"rForm"}>
                    <span className={"asciiLite"}>Username</span>
                    <br/>
                    <label>
                        <input type="text" name="username" placeholder={"Username"}/>
                    </label>

                    <p/>
                    <span className={"asciiLite"}>Password</span>
                    <br/>
                    <label>
                        <input type="password" name="password" placeholder={"Password"}/>
                    </label>

                    <p/>
                    <span id="errorSpan" className={this.isMessage ? 'asciiLite' : 'asciiLiteNoBackground'} style={{color:"red"}}/>
                    <p/>
                    <input id="registerButton" type="submit" value="Register" disabled/>
                    <p/>
                    <button onClick={() => {this.props.changePage("login", 0, 0)} }>Already registered? Login!</button>
                </form>
            </div>
        );
    }
}

/* The main component for the Monadic website. By default, this component renders the Regsiter component, but can also
   load the login page, and can load the other two main components, Content and User.
 */
class Monadic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "register"};
        this.changePage = this.changePage.bind(this);
    }

    changePage(newpage) {
        // update current page string and current course/lesson indices
        this.setState({page: newpage});
    }

    render() {
        if (this.state.page === "register") {
            return (
                <Register changePage={this.changePage}/>
            );
        } else if (this.state.page === "login") {
            return (
                <Login changePage={this.changePage}/>
            );
        } else if (this.state.page === "user") {
            return (<User/>);
        } else if (this.state.page === "content") {
            return (<Content/>);
        }
    }
}