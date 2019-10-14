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

class TextBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Please write an essay about your favorite DOM element.'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Essay:
                    <textarea value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class LessonElement extends React.Component {
    render() {
        return (
            <div>
                {console.log("in lesson")}
                {this.props.lelement.contents}
            </div>
        )
    }
}

class LessonList extends React.Component {
    /*
    constructor(props) {
        super(props);
        this.state = { markdown: '' };
    }
    componentWillMount() {
        fetch("../../../lessons/course_0/1.md").then(res => res.text()).then(text => this.setState({markdown: text}));
    }
     */
    render() {
        return (
            <div>
                {console.log("in lesson list")}
                {console.log(this.props.lessonlist)}
                <LessonElement lelement = {this.props.lessonlist.lessonElements[0]}/>
            </div>
        )
    }
}

class Course extends React.Component {
    render() {
        return (
            <div>
            <li key={this.props.course.id}> {
                <form>
                    {console.log("in course")}
                    <button onClick={() =>
                        console.log("hello world")}>
                        Try course: {this.props.course.id}
                    </button>
                    <p>
                        {console.log(this.props.course.lessonList[0])}
                        "About to print contents of 0"

                        {this.props.course.lessonList[0].lessonElements[0].contents}
                    </p>
                </form>
            } </li>
                {console.log("about to map lessonlist")}
                About to try to map list of lessons
                <ul>{this.props.course.lessonList.map(lessonlist => <LessonList key={lessonlist.id} lessonlist={lessonlist}/>)}</ul>
                about to make one single lesson list
            <LessonList lessonlist = {this.props.course.lessonList[0]}/>
            </div>
        );
    }
}

class CourseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { courses: [], curr: 0, page: "COURSE"};
    }

    async getDataFromServer() {
        // TODO get what course we are on from the server
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
