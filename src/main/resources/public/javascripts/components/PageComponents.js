// class LessonList extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <div>
//                 {/*{console.log("in lesson list")}*/}
//                 {/*{console.log(this.props.lessonlist)}*/}
//                 {this.props.lessonlist.lessonElements.map(lelement => <LessonElement key = {lelement.id} lelement = {lelement}/>)}
//             </div>
//         )
//     }
// }

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

class LessonNavigation extends React.Component {
    render() {
        return (
            <div>
                <li>
                    <button onClick={() => {this.props.changePage("course", this.props.currCourse, 0)} }>Back to Course {this.props.currCourse}</button>
                    <br></br>
                    <button onClick={() => {this.props.changePage("lesson", this.props.currCourse, this.props.currLesson - 1)} }>Previous Lesson</button>
                    <button onClick={() => {this.props.changePage("lesson", this.props.currCourse, this.props.currLesson + 1)} }>Next Lesson</button>
                </li>
            </div>
        );
    }
}

class Lesson extends React.Component {
    render() {
        const lesson = this.props.currLesson;
        const course = this.props.currCourse;
        let conv = new showdown.Converter();
        let html = conv.makeHtml(this.props.courses[course].lessonList[lesson].lessonElements[0].contents);
        return (
            <div>
                <LessonNavigation currLesson={this.props.currLesson} currCourse={this.props.currCourse} changePage={this.props.changePage}/>
                <div dangerouslySetInnerHTML={{__html: html}}/>
                <LessonNavigation currLesson={this.props.currLesson} currCourse={this.props.currCourse} changePage={this.props.changePage}/>
            </div>
        );
    }
}

class LessonButton extends React.Component {
    render() {
        return (
            <div>
                <li> {
                    <form>
                        <button onClick={() => {this.props.changePage("lesson", this.props.currCourse, this.props.lesson.id)} }>Lesson {this.props.lesson.id}</button>
                    </form>
                } </li>
            </div>
        );
    }
}

class Course extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // console.log(this.props.courses);
        const course = this.props.currCourse;
        return (
            <div>
                <button onClick={() => {this.props.changePage("courselist", 0, 0)}}>Back to Courses</button>
                <br></br>
                <button onClick={() => {this.props.changePage("course", this.props.currCourse - 1, 0)}}>Previous Course</button>
                <button onClick={() => {this.props.changePage("course", this.props.currCourse + 1, 0)}}>Next Course</button>
                <ul>{this.props.courses[course].lessonList.map(lesson => <LessonButton key={lesson.id} lesson={lesson} currCourse={this.props.currCourse} changePage={this.props.changePage}/>)}</ul>
            </div>
        )
    }
}

class CourseButton extends React.Component {
    render() {
        return (
            <div>
                <li> {
                    <form>
                        <button onClick={() => {this.props.changePage("course", this.props.course.id, 0)} }>Course {this.props.course.id}</button>
                    </form>
                } </li>
            </div>
        );
    }
}

class CourseList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.courses);
        return (
            <div>
                <ul>{this.props.courses.map(course => <CourseButton key={course.id} course={course} changePage={this.props.changePage}/>)}</ul>
            </div>
        )
    }
}

class Monadic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "courselist", currCourse: 0, currLesson: 0, courses: []};
        this.changePage = this.changePage.bind(this);
    }

    async componentDidMount() {
        this.setState({ courses: await (await fetch("/courses")).json() });
    }

    changePage(newpage, course, lesson) {
        // console.log("in change page")
        this.setState({page: newpage});
        this.setState({currCourse: course});
        this.setState({currLesson: lesson});
    }


    render() {
        // console.log(this.state)
        if (this.state.page === "courselist") {
            return (
                <div>
                    <h1>Welcome to Monadic!</h1>
                    <h2>Available Courses</h2>
                    <CourseList changePage={this.changePage} courses={this.state.courses} currCourse={this.state.currCourse}/>
                </div>
            );
        } else if (this.state.page === "course") {
            return (
                <div>
                    <h1>Course {this.state.currCourse}</h1>
                    <h2>Available Lessons</h2>
                    <Course changePage={this.changePage} courses={this.state.courses} currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                </div>
            );
        } else if (this.state.page === "lesson") {
            return (
                <div>
                    <Lesson changePage={this.changePage} courses={this.state.courses} currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                </div>
            );
        }
    }

}