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
                        {this.props.course.id}
                    </p>
                </form>
            } </li>
        );
    }
}

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
            </div>
        )
    }
}
