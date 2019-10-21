class LessonElement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.element.contents);
        let conv = new showdown.Converter();
        let html = conv.makeHtml(this.props.element.contents);
        return (
            <div>
                <div dangerouslySetInnerHTML={{__html: html}}/>
            </div>
        );
    }
}

class LessonNavigation extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => {this.props.changePage("course", this.props.currCourse, 0)} }>Back to Course {this.props.currCourse}</button>
                <br></br>
                <button style={{display: 0 <= this.props.currLesson - 1 ? "inline" : "none"}} onClick={() => {this.props.changePage("lesson", this.props.currCourse, this.props.currLesson - 1)} }>Previous Lesson</button>
                <button style={{display: this.props.numLessons > this.props.currLesson + 1 ? "inline" : "none"}} onClick={() => {this.props.changePage("lesson", this.props.currCourse, this.props.currLesson + 1)} }>Next Lesson</button>
            </div>
        );
    }
}

class Lesson extends React.Component {
    render() {
        const lesson = this.props.currLesson;
        const course = this.props.currCourse;
        const numLessons = Object.keys(this.props.courses[course].lessonList).length;

        let conv = new showdown.Converter();
        let html = conv.makeHtml(this.props.courses[course].lessonList[lesson].lessonElements[0].contents);
        return (
            <div>
                <LessonNavigation numLessons={numLessons} currLesson={this.props.currLesson} currCourse={this.props.currCourse} changePage={this.props.changePage}/>
                {this.props.courses[course].lessonList[lesson].lessonElements.map(element => <LessonElement key={lesson.id} element={element}/>)}
                {/*<div dangerouslySetInnerHTML={{__html: html}}/>*/}
                <LessonNavigation numLessons={numLessons} currLesson={this.props.currLesson} currCourse={this.props.currCourse} changePage={this.props.changePage}/>
            </div>
        );
    }
}

class LessonButton extends React.Component {
    render() {
        return (
            <NoBullet>
                <li>
                    <button onClick={() => {this.props.changePage("lesson", this.props.currCourse, this.props.lesson.id)} }>Lesson {this.props.lesson.id}</button>
                </li>
            </NoBullet>
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
        const numCourses = Object.keys(this.props.courses).length;
        return (
            <div>
                <button onClick={() => {this.props.changePage("courselist", 0, 0)}}>Back to Courses</button>
                <br></br>
                <button style={{display: 0 <= this.props.currCourse - 1 ? "inline" : "none"}} onClick={() => {this.props.changePage("course", this.props.currCourse - 1, 0)}}>Previous Course</button>
                <button style={{display: numCourses > this.props.currCourse + 1 ? "inline" : "none"}} onClick={() => {this.props.changePage("course", this.props.currCourse + 1, 0)}}>Next Course</button>
                <ul>{this.props.courses[course].lessonList.map(lesson => <LessonButton key={lesson.id} lesson={lesson} currCourse={this.props.currCourse} changePage={this.props.changePage}/>)}</ul>
            </div>
        );
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
        // console.log(this.props.courses);
        return (
            <div>
                <ul>{this.props.courses.map(course => <CourseButton key={course.id} course={course} changePage={this.props.changePage}/>)}</ul>
            </div>
        );
    }
}

const Space = window.styled.div`
  background-image: url("/outrspc2.gif");
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
`;

const EarthBound = window.styled.div`
  background-image: url("/325.png");
  height: auto;
  position: absolute;
  left: 0;
  width: auto;
  background-size: auto auto;
`;

const LessonBack = window.styled.div`
    font-family: "Times New Roman", Times, serif;
    color: white;
    text-align: left;
    font-size: 1em;
`;

const NoBullet = window.styled.div`
    list-style: none;
`;

const Format = window.styled.div`
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    color: white;
    text-align: center;
    font-size: 1em;
    list-style: none;
`;

const Title = window.styled.h1`
  font-size: 5em;
  text-align: center;
  color: white;
`;

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
        this.setState({page: newpage});
        this.setState({currCourse: course});
        this.setState({currLesson: lesson});
    }


    render() {
        if (this.state.page === "courselist") {
            return (
                <Space>
                    <Format>
                        <Title>Welcome to Monadic!</Title>
                        <h2>Available Courses</h2>
                        <CourseList changePage={this.changePage} courses={this.state.courses} currCourse={this.state.currCourse}/>
                    </Format>
                </Space>
            );
        } else if (this.state.page === "course") {
            return (
                <Space>
                    <Format>
                        <Title>Course {this.state.currCourse}</Title>
                        <h2>Available Lessons</h2>
                        <Course changePage={this.changePage} courses={this.state.courses} currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </Space>
            );
        } else if (this.state.page === "lesson") {
            return (
                <EarthBound>
                    <LessonBack>
                        <Lesson changePage={this.changePage} courses={this.state.courses} currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </LessonBack>
                </EarthBound>
            );
        }
    }

}