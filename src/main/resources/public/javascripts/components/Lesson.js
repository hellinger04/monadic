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
            this.mirror = CodeMirror.fromTextArea(document.getElementById('codeblock' + this.props.element.id), {
                mode: this.language,
                theme: "monokai",
                readOnly: "nocursor",
                lineWrapping: true
            });
        } else {
            this.mirror = CodeMirror.fromTextArea(document.getElementById('codeblock' + this.props.element.id), {
                mode: "text/typescript",
                theme: "monokai",
                readOnly: "nocursor",
                lineWrapping: true
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
        let numCorrect = 0;

        for (let i = 0; i < this.props.student.length; i++) {
            if (this.props.expected[i] === this.props.student[i]) {
                // if student result matches expected result, save 'correct' statement to results array
                results.push(<li className={"problemText"} key={i}>
                    Test {i + 1}: Correct! Expected output is {this.props.expected[i]} and actual output was&nbsp;
                    {this.props.student[i]}
                </li>);
                numCorrect++;
            } else if (this.props.expected !== this.props.student[i]) {
                // if student result does not match expected result, save 'incorrect' statement to results array
                results.push(<li className={"incorrect"} key={i}>
                    Test {i + 1}: Wrong! Expected output is {this.props.expected[i]} but actual output was&nbsp;
                    {this.props.student[i]}
                </li>);
            }
        }

        if (this.props.error === "No errors!") {
            return (
                <div class={"problemText"}>
                    <p>Number of submissions: {this.props.numSubmissions}</p>
                    <p>{this.props.student.length > 0 ? <div>Passed {numCorrect} out of&nbsp;
                        {this.props.student.length} tests:</div> : null}</p>
                    <ul>{results.map(result => <NoBullet><li>{result}</li></NoBullet>)}</ul>
                </div>
            );
        } else {
            return (
                <div class={"problemText"}>
                    <p>Number of submissions: {this.props.numSubmissions}</p>
                    <p style={{color: 'red'}}>Error: {this.props.showError ? this.props.error : null}</p>
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
        this.passedTests = 0;
        this.studentResults = [];
        this.expectedOutputs = [];
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
            lineWrapping: true,
            extraKeys: {"Ctrl-Space": "autocomplete", "Cmd-Space": "autocomplete"}
        });
    }

    showResults() {
        // causes TestResults component to re-render
        this.setState({results: true});
    }

    handleClick() {
        //initialize passed tests to 0 each time problem is submitted
        this.passedTests = 0;

        // map over available tests for current problem and grade student submission for each test
        this.props.element.tests.map(test => this.grade(this.mirror.getValue(), test));

        // increment submission count and call method to update TestResults component
        this.count++;
        this.showErr = true;
        this.showResults();

        //determine whether all tests were passed
        let result = 0;
        if (this.passedTests === this.props.element.tests.length) {
            result = 2;
        }

        let data = {
            Username: this.props.user,
            CourseID: this.props.currCourse.toString(),
            LessonID: this.props.currLesson.toString(),
            ElementID: this.props.element.id.toString(),
            ProblemStatus: result.toString()
        };

        let dataJSON = JSON.stringify(data);

        fetch('/users/setProblemStatus', {
            method: 'POST',
            body: dataJSON,
        }).then((function(response) { console.log("Changed problem status!"); }).bind(this));

        this.props.getUserStatus();
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

            //update count of passed tests
            if (this.studentResults[test.id] === this.expectedOutputs[test.id]) {
                this.passedTests++;
            }
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
        for (let i = 0; i < this.props.element.tests.length; i++) {
            this.expectedOutputs[i] = this.props.element.tests[i].output;
        }

        return (
            <div className={"lessonContainer"}>
                <textarea id = {'problem' + this.props.element.id}>{this.props.element.starterCode}</textarea>
                <button onClick={() => this.handleClick()}>Save and Submit</button>
                <TestResults numSubmissions={this.count} student={this.studentResults} expected={this.expectedOutputs}
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
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"lessonNavigation"}>
                <button onClick={() => {
                    this.props.changePage("courselist", this.props.currCourse, 0)}}>Back to the Main Page
                </button>

                <br></br>

                <button style={{display: 0 <= this.props.currLesson - 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, Number(this.props.currLesson) - 1)
                        }}>Previous Lesson
                </button>

                <button style={{display: ((this.props.userStatus["c" + this.props.currCourse + "_l" + this.props.currLesson] === 2) && (this.props.numLessons >= this.props.currLesson + 1) ? "inline" : "none")}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, Number(this.props.currLesson) + 1)
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
                                  currCourse={this.props.currCourse} changePage={this.props.changePage}
                                  userStatus={this.props.userStatus}/>

                <div className={"lessonBody"}>
                    {this.props.courses[this.props.currCourse].lessonList[this.props.currLesson].lessonElements.map(
                        element => {
                            return element.problem ?
                                <Problem key={this.props.currLesson + " " + element.id} element={element}
                                         currCourse={this.props.currCourse } currLesson={this.props.currLesson}
                                         user={this.props.user} getUserStatus={this.props.getUserStatus}/> :
                                <TextElement key={this.props.currLesson + " " + element.id} element={element}/>
                        }
                    )}
                </div>

                <LessonNavigation numLessons={numLessons} currLesson={this.props.currLesson}
                                  currCourse={this.props.currCourse} changePage={this.props.changePage}
                                  userStatus={this.props.userStatus}/>
            </div>
        );
    }
}