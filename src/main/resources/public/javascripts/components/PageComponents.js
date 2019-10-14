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
        let conv = new showdown.Converter();
        let html = conv.makeHtml(this.props.lelement.contents);
        return (
            <div dangerouslySetInnerHTML={{__html: html}}/>
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
                {/*{console.log("in lesson list")}*/}
                {/*{console.log(this.props.lessonlist)}*/}
                {this.props.lessonlist.lessonElements.map(lelement => <LessonElement key = {lelement.id} lelement = {lelement}/>)}
            </div>
        )
    }
}

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {curr: 0};
    }

    render() {
        console.log(this.props.courses);
        return (
            <div>
                <GoToNext onClick={() => this.setState({curr: this.state.curr+1})}/>
                <ul>{this.props.courses.map(course => <CourseButton key={course.id} course={course} changePage={this.props.changePage}/>)}</ul>
            </div>
        )
    }
}

class CourseButton extends React.Component {
    render() {
        return (
            <div>
                <li key={this.props.course.id}> {
                    <form>
                        <button onClick={() => {this.props.changePage("course", this.props.course.id)} }>Try course: {this.props.course.id}</button>
                    </form>
                } </li>
            </div>
        );
    }
}

class CourseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {curr: 0};
    }

    render() {
        console.log(this.props.courses);
        return (
            <div>
                <GoToNext onClick={() => this.setState({curr: this.state.curr+1})}/>
                <ul>{this.props.courses.map(course => <CourseButton key={course.id} course={course} changePage={this.props.changePage}/>)}</ul>
            </div>
        )
    }
}

class Monadic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "courselist", curr: 0, courses: []};
        this.changePage = this.changePage.bind(this);
    }

    async componentDidMount() {
        this.setState({ courses: await (await fetch("/courses")).json() });
    }

    changePage(newpage, index) {
        // console.log("in change page")
        this.setState({page: newpage})
        this.setState({curr: index})
    }


    render() {
        // console.log(this.state)
        if (this.state.page === "courselist") {
            return (
                <div>
                    <CourseList changePage={this.changePage} courses={this.state.courses}/>
                </div>
            );
        } else if (this.state.page === "course") {
            return (
                <div>
                    <Course changePage={this.changePage}/>
                </div>
            );
        }
    }

}
