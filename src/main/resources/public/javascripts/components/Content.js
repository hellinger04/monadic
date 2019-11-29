const Space = window.styled.div`
  background-image: url("/img/outrspc2.gif");
  height: auto;
  position: absolute;
  left: 0;
  width: auto;
  background-size: auto auto;
  overflow: auto;
`;

const EarthBound = window.styled.div`
  background-image: url("/img/back2.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100%;
  overflow: auto;
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


/* This component takes TypeScript code and displays it as a read-only CodeMirror text box. This allows for code syntax
   highlighting, and makes the code formatting neat.
 */
class CodeBlock extends React.Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.language = this.props.element.contents.substring(3, this.props.element.contents.indexOf("\n"))
    }

    componentDidMount() {
        if (this.language.match("javascript") === null && this.language.match("typescript") === null) {
            console.log(this.language);
            this.mirror = CodeMirror.fromTextArea(document.getElementById('codeblock' + this.props.element.id), {
                mode: this.language,
                theme: "monokai",
                readOnly: "nocursor"
            });
        } else {
            this.mirror = CodeMirror.fromTextArea(document.getElementById('codeblock' + this.props.element.id), {
                mode: "text/typescript",
                theme: "monokai",
                readOnly: "nocursor"
            });
        }
    }

    render()  {
        let endIndex = this.props.element.contents.length - 4;
        let editedContents = this.props.element.contents.substring((this.props.element.contents.indexOf("\n") + 1), endIndex);
        return (
            <div>
                <textarea id={'codeblock' + this.props.element.id}>{editedContents}</textarea>
            </div>
        );
    }
}

/* This component takes the student test results and the expected results and displays information regarding the
   student's performance on the tests. The component will also display any errors that occurred when running the
   student's code. This component assists the Problem component
 */
class TestResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {submissions: 0};
        this.space = " ";
    }

    render() {
        // create array to store test results
        let results = [];

        for (let i = 0; i < this.props.student.length; i++) {
            if (this.props.expected[i] === this.props.student[i]) {
                // if student result matches expected result, save 'correct' statement to results array
                results.push(<p style={{color: 'white'}} className='result' key={i}>
                    Correct! Expected output was {this.props.expected[i]} and actual output was {this.props.student[i]}
                </p>);
            } else if (this.props.expected !== this.props.student[i]) {
                // if student result does not match expected result, save 'incorrect' statement to results array
                results.push(<p style={{color: 'red'}} className='result' key={i}>
                    Wrong! Expected output was {this.props.expected[i]} but actual output was {this.props.student[i]}
                </p>);
            }
        }

        if (this.props.error === "No errors!") {
            return (
                <div className={"lessCode"}>
                    Number of submissions: {this.props.numSubmissions}
                    <p style={{color: 'green'}} className={"lessCode"}> {this.props.showError ? this.props.error : null } </p>
                    <ul className={"lessCode"}> {results.map(result => <li className={"lessCode"}>{result}</li>)} </ul>
                </div>
            );
        } else {
            return (
                <div className={"lessCode"}>
                    Number of submissions: {this.props.numSubmissions}
                    <p style={{color: 'red'}}> {this.props.showError ? this.props.error : null } </p>
                </div>
            );
        }
    }

}


/* This component takes starter code and displays a CodeMirror text box which students will use to write their solution
   to the given problem. The class contains logic for grading and parsing the student's code.
 */
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
        let pt2;
        while(index >= 0) {
            let index2 = answer.indexOf(end, index);
            let pt1 = answer.substring(0, index);
            if (index2 !== -1) {
                pt2 = answer.substring(index2 + ind, answer.length);
            } else {
                pt2 = "";
            }
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


/* This component takes lesson content and displays it as HTML using the dangerouslySetInnerHTML method. It's safe to
   use this otherwise dangerous method since no lesson text contains text boxes which can be edited or submitted. If the
   content is a block of code that needs to be displayed, this code is rendered using the CodeBlock component.
 */
class TextElement extends React.Component {
    render() {
        let conv = new showdown.Converter();
        if (this.props.element.contents.substring(0,3) === "```") {
            return (
                <div className={"lessonContainer"}>
                    <CodeBlock element={this.props.element}/>
                </div>
            );
        } else {
            let html = conv.makeHtml(this.props.element.contents);

            return (
                <div className={"lessonContainer"}>
                    <div dangerouslySetInnerHTML={{__html: html}} className={"lessTxt"}/>
                </div>
            );
        }
    }
}


/* This component takes current lesson and course information and renders buttons which allow the user to advance to the
   next lesson, revert to the previous lesson, and return to the course that the lesson belongs to. The states for these
   different pages are all stored in the Content component.
 */
class LessonNavigation extends React.Component {
    render() {
        return (
            <div className={"lessonNavigation"}>
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


/* This component uses the courses, currCourse, and currLesson props to map over the lesson elements in the desired
   lesson. The component renders each lesson element as either a Problem or a TextElement depending on the element's
   type. The component also uses the LessonNavigation component to render navigation buttons for the user.
 */
class Lesson extends React.Component {
    render() {
        // count the total lessons available in current course (used to determine which buttons to display)
        const numLessons = Object.keys(this.props.courses[this.props.currCourse].lessonList).length;

        return (
            <div>
                <LessonNavigation numLessons={numLessons} currLesson={this.props.currLesson}
                                  currCourse={this.props.currCourse} changePage={this.props.changePage}/>

                <div className={"lessonBody"}>
                    {this.props.courses[this.props.currCourse].lessonList[this.props.currLesson].lessonElements.map(
                        element => {
                            return element.problem ?
                                <Problem key={this.props.currLesson + " " + element.id} element={element}/> :
                                <TextElement key={this.props.currLesson + " " + element.id} element={element}/>
                        }
                    )}
                </div>

                <LessonNavigation numLessons={numLessons} currLesson={this.props.currLesson}
                                  currCourse={this.props.currCourse} changePage={this.props.changePage}/>
            </div>
        );
    }
}


/* This component uses the currCourse and courses props to render buttons for available course lessons. It also renders
   buttons which the user can use to navigate to the next or previous course, and also to return to the list of courses.
 */
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

                <br></br>
                <br></br>

                <h2>Available Lessons</h2>


                <li>{this.props.courses[course].lessonList.map(lesson =>
                    <NoBullet>
                        <li>
                            <button onClick={() => {
                                this.props.changePage("lesson", this.props.currCourse, lesson.id)}}>Lesson {lesson.id}
                            </button>
                        </li>
                    </NoBullet>
                )}
                </li>
            </div>
        );
    }
}

/* This component uses the courses prop to display a list of available courses to the user.
 */
class CourseList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NoBullet>
                <li>{this.props.courses.map(course =>
                    <li>
                        <button onClick={() => {
                            this.props.changePage("course", course.id, 0)}}>Course {course.id}
                        </button>
                    </li>
                )}
                </li>
            </NoBullet>
        );
    }
}


/* The main Content component. This component keeps track of state throughout courses and lessons, and defines the
   changePage() function used in subcomponents to change states and navigate through the pages. When this component
   mounts, it initiates a GET request from the Server to obtain information about all available courses.
 */
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "courselist", currCourse: 0, currLesson: 0, courses: []};
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
        if (this.state.page === "courselist") {
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