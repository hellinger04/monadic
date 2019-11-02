const Space = window.styled.div`
  background-image: url("/img/outrspc2.gif");
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
`;

const EarthBound = window.styled.div`
  background-image: url("/img/325.png");
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

class TestResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submissions: 0};
    }

    render() {

        let student = this.props.student;
        let expected = this.props.expected;
        let tests = [];
        console.log(student);

        for(let i = 0; i < student.length; i++) {
            console.log("current index: " + i);
            console.log("current value: " + student[i]);
            if(expected[i] === student[i]) {
                tests.push(<p style={{color: 'white'}} className='test' key={i}>
                    Correct! Expected output was {expected[i]} and actual output was {student[i]}</p>);
            } else if (expected !== student[i]) {
                tests.push(<p style={{color: 'red'}} className='test' key={i}>
                    Wrong! Expected output was {expected[i]} but actual output was {student[i]}</p>);
            }
        }
        return (
            <div>
                Number of submissions: {this.props.numSubmissions}
                {tests.map(test => <li>{test}</li>)}
            </div>
        );
    }

}


class Problem extends React.Component {
    constructor(props) {
        super(props);
        this.grade = this.grade.bind(this);
        this.count = 0;
        this.studentResults = [];
        this.state = {results: false};
    }

    componentDidMount() {
       this.mirror = CodeMirror.fromTextArea(document.getElementById('problem' + this.props.element.id), {
           mode: "javascript",
           theme: "solarized"
       });
    }

    showResults() {
        this.setState({results: true});
    }

    handleClick() {
        this.props.element.tests.map(test => this.grade(this.mirror.getValue(), test))
        this.count++;
        this.showResults();
    }

    grade(studentAnswer, test) {
        let script = studentAnswer + test.input;
        let output = eval(script).toString();
        this.studentResults[test.id] = output;
    }

    render()  {
        // store expected output values in array to pass to TestResults
        let expectedOutputs = [];
        for (let i = 0; i < this.props.element.tests.length; i++) {
            expectedOutputs[i] = this.props.element.tests[i].output;
        }
        return (
            <div>
                <textarea id = {'problem' + this.props.element.id}>{this.props.element.starterCode}</textarea>
                <button onClick={() => this.handleClick()}>Save and Submit</button>
                <TestResults numSubmissions={this.count} student={this.studentResults} expected={expectedOutputs}/>
            </div>
        );
    }
}

class TextElement extends React.Component {
   render() {
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
                <button onClick={() => {
                        this.props.changePage("course", this.props.currCourse, 0)}}
                >Back to Course {this.props.currCourse}</button>

                <br></br>

                <button style={{display: 0 <= this.props.currLesson - 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, this.props.currLesson - 1)
                        }}
                >Previous Lesson</button>

                <button style={{display: this.props.numLessons > this.props.currLesson + 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, this.props.currLesson + 1)
                        }}
                >Next Lesson</button>
            </div>
        );
    }
}

class Lesson extends React.Component {
    render() {
        const lessonID = this.props.currLesson;
        const courseID = this.props.currCourse;
        const numLessons = Object.keys(this.props.courses[courseID].lessonList).length;

        const l = this.props.courses[courseID].lessonList[lessonID];
        const lessonElements = l.lessonElements;
        return (
            <div>
                <LessonNavigation numLessons={numLessons} currLesson={lessonID} currCourse={courseID}
                                  changePage={this.props.changePage}/>

                {lessonElements.map(element => {
                    return element.problem ?
                        <Problem key={lessonID + " " + element.id} element={element}/> :
                        <TextElement key={lessonID + " " + element.id} element={element}/>
                    })
                }

                <LessonNavigation numLessons={numLessons} currLesson={lessonID} currCourse={courseID}
                                  changePage={this.props.changePage}/>
            </div>
        );
    }
}

class LessonButton extends React.Component {
    render() {
        return (
            <NoBullet>
                <li>
                    <button onClick={() => {
                        this.props.changePage("lesson", this.props.currCourse, this.props.lesson.id)}}
                    >Lesson {this.props.lesson.id}</button>
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
                <button onClick={() => {
                    this.props.changePage("courselist", 0, 0)}}
                >Back to Courses</button>

                <br></br>

                <button style={{display: 0 <= this.props.currCourse - 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("course", this.props.currCourse - 1, 0)
                        }}
                >Previous Course</button>

                <button style={{display: numCourses > this.props.currCourse + 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("course", this.props.currCourse + 1, 0)
                        }}
                >Next Course</button>

                <ul>{this.props.courses[course].lessonList.map(lesson =>
                    <LessonButton key={lesson.id} lesson={lesson} currCourse={this.props.currCourse}
                                  changePage={this.props.changePage}/>)}
                </ul>
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
                        <button onClick={() => {
                            this.props.changePage("course", this.props.course.id, 0)}}
                        >Course {this.props.course.id}</button>
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
                <ul>{this.props.courses.map(course =>
                    <CourseButton key={course.id} course={course} changePage={this.props.changePage}/>)}</ul>
            </div>
        );
    }
}

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        console.log("in handle submit")
        this.props.changePage("courselist", 0, 0)
    }

    render() {
        // console.log(this.props.courses);
        return (
            <div>
                <button onClick={() => {this.props.changePage("landing", 0, 0)}}>Go home</button>
                <br></br>
                <button onClick={() => {this.props.changePage("landing", 0, 0)} }>Already registered? Login!</button>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="new name" />
                    </label>
                    <label>
                        Password:
                        <input type="text" password="password" />
                    </label>
                    <input type="submit" value="Register" />
                </form>
            </div>
        );
    }
}
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        console.log("in handle submit")
        this.props.changePage("courselist", 0, 0)
    }

    render() {
        // console.log(this.props.courses);
        return (
            <div>
                <button onClick={() => {this.props.changePage("landing", 0, 0)}}>Go home</button>
                <br></br>
                <button onClick={() => {this.props.changePage("register", 0, 0)} }>Register</button>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" />
                    </label>
                    <label>
                        Password:
                        <input type="text" password="password" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

class Monadic extends React.Component {
    constructor(props) {
        super(props);
        //I SET THIS TO GO TO COURSE LIST BECAUSE LOGIN WON'T LET ME
        //GET TO COURSE LIST EVEN IF I REGISTER BECAUSE
        //WE ARE NOT SENDING ANYTHING TO THE SERVER FROM LOGIN RIGHT NOW BUT
        //JUST IGNORE THAT
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
                        <CourseList changePage={this.changePage} courses={this.state.courses}
                                    currCourse={this.state.currCourse}/>
                    </Format>
                </Space>
            );
        } else if (this.state.page === "landing") {
            return (
                <Space>
                    <Format>
                        <Title>Welcome to Monadic!!!</Title>
                        <h2>You should login to an account</h2>
                        <Login changePage={this.changePage} courses={this.state.courses}
                               currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </Space>
            );
        } else if (this.state.page === "register") {
            return (
                <Space>
                    <Format>
                        <Title>Register now!!!</Title>
                        <h2>You should make an account</h2>
                        <Register changePage={this.changePage} courses={this.state.courses}
                                  currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </Space>
            );
        } else if (this.state.page === "course") {
            return (
                <Space>
                    <Format>
                        <Title>Course {this.state.currCourse}</Title>
                        <h2>Available Lessons</h2>
                        <Course changePage={this.changePage} courses={this.state.courses}
                                currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </Space>
            );
        } else if (this.state.page === "lesson") {
            return (
                <EarthBound>
                    <LessonBack>
                        <Lesson changePage={this.changePage} courses={this.state.courses}
                                currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </LessonBack>
                </EarthBound>
            );
        }
    }

}
