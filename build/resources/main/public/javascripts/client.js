const getDataFromServer = async () => {
    const response = await fetch("/courses");
    const dataFromServer = await response.json();
    const Header = () => <h1>Monadic</h1>

    class CourseList extends React.Component {
        constructor(props) {
            super(props);
            this.state = { courses: [], curr: 0};
        }
        async getDataFromServer() {
            this.setState({ courses: await (await fetch("/courses")).json() });
            window.setTimeout(() => { this.getDataFromServer(); }, 1000);
        }

        componentDidMount() {
            this.getDataFromServer();
        }

        render() {
            console.log(this.state.courses);
            const cc = this.state.courses.filter(course => course.id === this.state.curr)
            console.log("curr" , this.state.curr);
            return (
                <div>
                    <GoToNext onClick={() => this.setState({curr: this.state.curr+1})}/>
                    <ul>{cc.map(course => <Course key={course.id} course={course}/>)}</ul>
                    <ul>{this.state.courses.map(course => <Course key={course.id} course={course}/>)}</ul>
                </div>
            )
        }
    }

    class Course extends React.Component {
        render() {
            return (
                <li key={this.props.course.id}> {
                    <form>
                        {console.log("in course")}
                        <button onClick={() =>
                            console.log("hello world")}>
                            Try course: {this.props.course.id}
                        </button>
                        <p>
                            {console.log(this.props.course.id)}
                        </p>
                    </form>
                } </li>
            );
        }
    }


    class GoToNext extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            return <button onClick={() => {
                this.props.onClick();
            }}>Next</button>;
        }
    }
    class Application extends React.Component {
        render() {
            return (
                <div>
                    <Header/>
                    <CourseList/>
                </div>
            )
        }
    }

    ReactDOM.render(
        <Application/>,
        document.querySelector("#application")
    )
    //we can't be like todoose and let people update lessons by sending
    //requests to the server, but later we will want to update people's
    //answer boxes every so often so we should still have this
    window.setTimeout(() => {getDataFromServer(); }, 200);
    //also note: button should be fetch click () => arrow fuction too keep it from
    //running every 200 ms
};
getDataFromServer();
