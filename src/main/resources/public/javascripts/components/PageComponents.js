const Space = window.styled.div`
  background-image: url("/img/outrspc2.gif");
  height: auto;
  position: absolute;
  left: 0;
  width: auto;
  background-size: auto auto;
`;

const EarthBound = window.styled.div`
  background-image: url("/img/325.png");
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
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
        // store student results and expected results from props in variables for easier access
        let student = this.props.student;
        let expected = this.props.expected;
        let error = this.props.error;
        let showError = this.props.showError;
        // create array to store test results
        let results = [];

        for (let i = 0; i < student.length; i++) {
            if (expected[i] === student[i]) {
                // if student result matches expected result, save 'correct' statement to results array
                results.push(<p style={{color: 'white'}} className='result' key={i}>
                    Correct! Expected output was {expected[i]} and actual output was {student[i]}</p>);
            } else if (expected !== student[i]) {
                // if student result does not match expected result, save 'incorrect' statement to results array
                results.push(<p style={{color: 'red'}} className='result' key={i}>
                    Wrong! Expected output was {expected[i]} but actual output was {student[i]}</p>);
            }
        }

        if (error === "No errors!") {
            return (
                <div>
                    Number of submissions: {this.props.numSubmissions}
                    <p style={{color: 'green'}}> {this.props.showError ? error : null } </p>
                    {results.map(result => <li>{result}</li>)}
                </div>
            );
        } else {
            return (
                <div>
                    Number of submissions: {this.props.numSubmissions}
                    <p style={{color: 'red'}}> {this.props.showError ? error : null } </p>
                </div>
            );
        }
    }

}


class Problem extends React.Component {
    constructor(props) {
        super(props);
        this.grade = this.grade.bind(this);
        this.eliminateComments = this.eliminateComments.bind(this);
        this.parse = this.parse.bind(this);
        this.count = 0;
        this.studentResults = [];
        this.err = "No errors!";
        this.showErr = false;
        this.state = {results: false};
    }

    componentDidMount() {
        this.mirror = CodeMirror.fromTextArea(document.getElementById('problem' + this.props.element.id), {
            mode: "text/typescript",
            theme: "monokai",
            lineNumbers: true,
            styleActiveLine: true,
            autoCloseBrackets: true,
            continueComments: true,
            extraKeys: {"Ctrl-Space": "autocomplete", "Cmd-Space": "autocomplete"}
        });
    }

    showResults() {
        // causes TestResults component to re-render
        this.setState({results: true});
    }

    handleClick() {
        // map over available tests for current problem and grade student submission for each test
        this.props.element.tests.map(test => this.grade(this.mirror.getValue(), test))

        // increment submission count and call method to update TestResults component
        this.count++;
        this.showErr = true;
        this.showResults();
    }

    grade(studentAnswer, test) {
        // run student's code using the specified test value
        this.err = "No errors!";

        studentAnswer = this.parse(studentAnswer);

        let output;
        if(this.err === "No errors!") {
            try {
                output = eval(studentAnswer + test.input).toString();
            } catch (e) {
                if (e.message === "Cannot read property 'toString' of undefined") {
                    this.err = "Your function needs to return a value!"
                } else {
                    this.err = e.message;
                }
                this.studentResults[test.id] = "";
            }

            // update student results array with test output
            this.studentResults[test.id] = output;
        }
    }

    parse(studentAnswer) {
        studentAnswer = this.eliminateComments("//","\n",1, studentAnswer);
        studentAnswer = this.eliminateComments("/*","*/",2, studentAnswer);

        // checks for instances of for and while
        let disallowed = ["for", "while"];
        for (let i = 0; i < disallowed.length; i++) {
            disallowed[i] = "\\b" + disallowed[i].replace(" ", "\\b \\b") + "\\b";
            if(studentAnswer.toLowerCase().match(disallowed[i].toLowerCase())!=null){
                this.err = "You are not allowed to use " + disallowed[i].substring(2,
                    disallowed[i].length-2) +  " loops!";
            }
        }

        // checks if key monadic words exist
        if(this.props.element.keyWords[0] !== undefined) {
            for (let i = 0; i < this.props.element.keyWords.length; i++) {
                if (studentAnswer.toLowerCase().match(this.props.element.keyWords[i].toLowerCase()) == null) {
                    this.err = "You are not using " + this.props.element.keyWords[i].substring(2,
                        this.props.element.keyWords[i].length-2) + "!";
                }
            }
        }
        return studentAnswer;
    }

    eliminateComments(begin, end, ind, answer) {
        // takes out line and block comments
        let index = answer.indexOf(begin);
        while(index >= 0) {
            let index2 = answer.indexOf(end, index);
            let pt1 = answer.substring(0, index);
            let pt2 = answer.substring(index2 + ind, answer.length);
            answer = pt1 + pt2;
            index = answer.indexOf(begin);
        }
        return answer;
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
                <TestResults numSubmissions={this.count} student={this.studentResults} expected={expectedOutputs}
                             error={this.err} showError={this.showErr}/>
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
                    this.props.changePage("course", this.props.currCourse, 0)}}>Back to Course {this.props.currCourse}
                </button>

                <br></br>

                <button style={{display: 0 <= this.props.currLesson - 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, this.props.currLesson - 1)
                        }}>Previous Lesson
                </button>

                <button style={{display: this.props.numLessons > this.props.currLesson + 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, this.props.currLesson + 1)
                        }}>Next Lesson
                </button>
            </div>
        );
    }
}


class Lesson extends React.Component {
    render() {
        // store current course/lesson indices and lessonElements from props into variables for easy access
        const courseID = this.props.currCourse;
        const lessonID = this.props.currLesson;
        const lessonElements = this.props.courses[courseID].lessonList[lessonID].lessonElements;
        // count the total lessons available in current course (used to determine which buttons to display)
        const numLessons = Object.keys(this.props.courses[courseID].lessonList).length;

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
                        this.props.changePage("lesson", this.props.currCourse, this.props.lesson.id)}}>
                        Lesson {this.props.lesson.id}
                    </button>
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
        // store current course index and count total number of available courses
        const course = this.props.currCourse;
        const numCourses = Object.keys(this.props.courses).length;

        return (
            <div>
                <button onClick={() => {
                    this.props.changePage("courselist", 0, 0)}}>Back to Courses
                </button>

                <br></br>

                <button style={{display: 0 <= this.props.currCourse - 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("course", this.props.currCourse - 1, 0)
                        }}>Previous Course
                </button>

                <button style={{display: numCourses > this.props.currCourse + 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("course", this.props.currCourse + 1, 0)
                        }}>Next Course
                </button>

                <ul>{this.props.courses[course].lessonList.map(lesson =>
                        <LessonButton key={lesson.id} lesson={lesson} currCourse={this.props.currCourse}
                                  changePage={this.props.changePage}/>
                    )}
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
                            this.props.changePage("course", this.props.course.id, 0)}}>Course {this.props.course.id}
                        </button>
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
        return (
            <NoBullet>
                <li>{this.props.courses.map(course =>
                        <CourseButton key={course.id} course={course} changePage={this.props.changePage}/>
                    )}
                </li>
            </NoBullet>
        );
    }
}


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateLogin(response) {
        if (response.status === 401) {
            alert("Invalid username or password. Please try again")
        } else if (response.status === 200) {
            this.props.changePage("courselist", 0, 0)
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
            <div>
                <button onClick={() => {this.props.changePage("register", 0, 0)} }>No account? Register now!</button>
                <form onSubmit={this.handleSubmit}>
                    <br></br>
                    <label>
                        Username: <input type="text" name="username" />
                    </label>
                    <br></br>
                    <label>
                        Password: <input type="password" name="password" />
                    </label>
                    <br></br>
                    <br></br>
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.validateCredentials = this.validateCredentials.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changedUsername = false;
        this.changedPassword = false;
        this.invalidUsername = true;
        this.invalidPassword = true;
    }

    usernameExists(response) {
        if (response.status === 409) {
            alert("That username already exists. Please try another username.")
        } else if (response.status === 201) {
            this.props.changePage("courselist", 0, 0)
        }
    }

    validateCredentials(event) {
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
            message = message + "Username cannot be empty. ";
        }

        if (this.changedPassword && this.invalidPassword) {
            document.getElementById("registerButton").disabled = true;
            message = message + "Password must be 8 characters long.";
        }

        if (!(this.invalidUsername || this.invalidPassword)) {
            document.getElementById("registerButton").disabled = false;
        }

        // document.getElementById("errorSpan").style.property = new style
        // add <br> to inner HTML and remove one <br> from below the <span>
        document.getElementById("errorSpan").innerHTML = message;
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
            <div>
                <button onClick={() => {this.props.changePage("login", 0, 0)} }>Already registered? Login!</button>
                <form onChange={this.validateCredentials} onSubmit={this.handleSubmit}>
                    <br></br>
                    <br></br>
                    <label>
                        Username: <input type="text" name="username" />
                    </label>
                    <br></br>
                    <label>
                        Password: <input type="password" name="password" />
                    </label>
                    <br></br>
                    <span id="errorSpan" style={{color:"red"}}/>
                    <br></br>
                    <br></br>
                    <input id="registerButton" type="submit" value="Register" disabled/>
                </form>
            </div>
        );
    }
}


class Monadic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "register", currCourse: 0, currLesson: 0, courses: []};
        this.changePage = this.changePage.bind(this);
    }

    async componentDidMount() {
        this.setState({ courses: await (await fetch("/courses")).json() });
    }

    changePage(newpage, course, lesson) {
        // update current page string and current course/lesson indices
        this.setState({page: newpage});
        this.setState({currCourse: course});
        this.setState({currLesson: lesson});
    }


    render() {
        if (this.state.page === "register") {
            return (
                <EarthBound>
                    <Format>
                        <Title>Welcome to Monadic!</Title>
                        <h2>Register Now</h2>
                        <h3>It's quick and easy</h3>
                        <Register changePage={this.changePage} courses={this.state.courses}
                                  currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </EarthBound>
            );
        } else if (this.state.page === "login") {
            return (
                <EarthBound>
                    <Format>
                        <Title>Welcome to Monadic!</Title>
                        <h2>Login to View Courses</h2>
                        <Login changePage={this.changePage} courses={this.state.courses}
                               currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </EarthBound>
            );
        } else if (this.state.page === "courselist") {
            return (
                <EarthBound>
                    <Format>
                        <Title>Welcome to Monadic!</Title>
                        <h2>Available Courses</h2>
                        <CourseList changePage={this.changePage} courses={this.state.courses}
                                    currCourse={this.state.currCourse}/>
                    </Format>
                </EarthBound>
            );
        } else if (this.state.page === "course") {
            return (
                <EarthBound>
                    <Format>
                        <Title>Course {this.state.currCourse}</Title>
                        <h2>Available Lessons</h2>
                        <Course changePage={this.changePage} courses={this.state.courses}
                                currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </Format>
                </EarthBound>
            );
        } else if (this.state.page === "lesson") {
            return (
                <Space>
                    <LessonBack>
                        <Lesson changePage={this.changePage} courses={this.state.courses}
                                currCourse={this.state.currCourse} currLesson={this.state.currLesson}/>
                    </LessonBack>
                </Space>
            );
        }
    }

}