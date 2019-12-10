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
                <textarea id={'codeblock' + this.props.element.id} defaultValue={editedContents}/>
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
        this.numCorrect = 0;
        this.state = {submissions: 0};
        this.genList = this.genList.bind(this);
    }

    genList() {
        //reset numCorrect to 0
        this.numCorrect = 0;

        // create array to store test results
        let results = [];

        for (let i = 0; i < this.props.student.length; i++) {
            if (this.props.expected[i] === this.props.student[i]) {
                // if student result matches expected result, save 'correct' statement to results array
                results.push(<li className={"problemText"} key={i}>
                    Test {i + 1}: Correct! Expected output is {this.props.expected[i]} and actual output was&nbsp;
                    {this.props.student[i]}
                </li>);
                this.numCorrect++;
            } else if (this.props.expected !== this.props.student[i]) {
                // if student result does not match expected result, save 'incorrect' statement to results array
                results.push(<li className={"incorrect"} key={i}>
                    Test {i + 1}: Wrong! Expected output is {this.props.expected[i]} but actual output was&nbsp;
                    {this.props.student[i]}
                </li>);
            }
        }

        return results;
    }

    render() {
        if (this.props.error === "No errors!") {
            return (
                <div className={"problemText"}>
                    <p>Number of submissions: {this.props.numSubmissions}</p>
                    {this.props.student.length > 0 ? <p>Passed {this.numCorrect} out of&nbsp;
                        {this.props.student.length} tests:</p> : null}
                    <div className={"noBullet"}>{this.genList()}</div>
                </div>
            );
        } else {
            return (
                <div className={"problemText"}>
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
        this.studentAnswer = "";
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
        this.studentAnswer = this.mirror.getValue();

        // map over available tests for current problem and grade student submission for each test
        this.props.element.tests.map(test => this.grade(test));

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
            ProblemStatus: result.toString(),
            newSolution: this.studentAnswer.toString()
        };

        let dataJSON = JSON.stringify(data);

        fetch('/users/setProblemStatus', {
            method: 'POST',
            body: dataJSON,
        }).then((function(response) {  }).bind(this));

        //remove when TypeScript works
        this.props.getUserStatus(this.props.element.id, false);

        //uncomment when TypeScript works
        //this.props.getUserStatus(this.props.element.id, this.props.element.language === "TYPESCRIPT");
    }

    grade(test) {
        // run student's code using the specified test value
        this.err = "No errors!";

        this.parse();

        let output;
        if(this.err === "No errors!") {
            try {
                let answer = eval(this.studentAnswer + test.input);
                if (typeof answer === "undefined") {
                    output = JSON.stringify("undefined");
                } else if (typeof answer === "function" || typeof answer === "symbol") {
                    output = JSON.stringify(answer.toString());
                } else {
                    output = JSON.stringify(answer);
                }
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

    parse() {
        this.studentAnswer = this.eliminateComments("//","\n",1, this.studentAnswer);
        this.studentAnswer = this.eliminateComments("/*","*/",2, this.studentAnswer);

        /*
        // checks for instances of for and while
        let disallowed = ["for", "while"];
        for (let i = 0; i < disallowed.length; i++) {
            disallowed[i] = "\\b" + disallowed[i].replace(" ", "\\b \\b") + "\\b";
            if(this.studentAnswer.toLowerCase().match(disallowed[i].toLowerCase()) != null){
                this.err = "You are not allowed to use " + disallowed[i].substring(2,
                    disallowed[i].length-2) +  " loops!";
            }
        }

        // checks if key monadic words exist
        if(this.props.element.keyWords[0] !== undefined) {
            for (let i = 0; i < this.props.element.keyWords.length; i++) {
                if (this.studentAnswer.toLowerCase().match(this.props.element.keyWords[i].toLowerCase()) == null) {
                    this.err = "You are not using " + this.props.element.keyWords[i].substring(2,
                        this.props.element.keyWords[i].length-2) + "!";
                }
            }
        }
        */

        // Checks if key monadic words/function calls exist
        let keyPairs = this.props.element.keyPairs;
        if (Object.keys(keyPairs).length !== 0) {
            for (const fnName in keyPairs) {
                try {
                    let fnStr = eval(this.studentAnswer + (fnName + ".toString()"));
                    let fnBody = fnStr.slice(fnStr.indexOf("{") + 1, fnStr.lastIndexOf("}"));
                    let keywords = keyPairs[fnName];
                    for (let i = 0; i < keywords.length; ++i) {
                        let kw = keywords[i];
                        if (kw.startsWith("!")) {
                            kw = kw.slice(1, kw.length);
                            // Regex is to avoid hiding keywords in middle of variable names
                            if (fnBody.match("(?<![\\w\\d_$]+)" + kw + "(?![\\w\\d_$]+)") !== null) {
                                this.err = "You are using disallowed keyword " + kw + " in " + fnName + "!";
                            }
                        } else {
                            // Regex is to avoid hiding keywords in middle of variable names
                            if (fnBody.match("(?<![\\w\\d_$]+)" + kw + "(?![\\w\\d_$]+)") === null) {
                                this.err = "You are not using " + kw + " in " + fnName + "!";
                            }
                        }

                    }
                } catch(e) {
                    this.err = e.message;
                }
            }
        }
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
        let code = "";
        try {
            // store expected output values in array to pass to TestResults
            for (let i = 0; i < this.props.element.tests.length; i++) {
                this.expectedOutputs[i] = this.props.element.tests[i].output;
            }

            let problemID = "c" + this.props.currCourse + "_l" + this.props.currLesson + "_p" + this.props.element.id;

            if (this.props.user === "admin") {
                code = this.props.element.answerCode;
            } else {

                code = this.props.userStatus.solutions[problemID]
            }
        } catch (e) {
            code = "loading..."
            //code = this.props.element.starterCode;
        }

        return (
            <div className={"lessonContainer"}>
                <textarea id={'problem' + this.props.element.id} defaultValue={code}/>
                <br></br>
                <button id={'save'} className={"mc-button"} onClick={() => this.handleClick()}>Save and Submit</button>
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
        } else if (this.props.element.contents.indexOf("![") > -1) {
            let begin = this.props.element.contents.indexOf("![");
            let end = this.props.element.contents.indexOf(")", begin) + 1;

            let before = this.props.element.contents.substring(0, begin);
            let img = this.props.element.contents.substring(begin, end);
            let imgCaption = this.props.element.contents.substring(end + 2, this.props.element.contents.indexOf(")", end) + 1);
            let after = this.props.element.contents.substring(this.props.element.contents.indexOf(")", end) + 2, this.props.element.contents.length);

            let beforeHTML = conv.makeHtml(before);
            let imgHTML = conv.makeHtml(img);
            let imgCaptionHTML = conv.makeHtml(imgCaption);
            let afterHTML = conv.makeHtml(after);

            return (
                <div className={"lessonContainer"}>
                    <div dangerouslySetInnerHTML={{__html: beforeHTML}} className={"lessTxt"}/>
                    <div dangerouslySetInnerHTML={{__html: imgHTML}} className={"lessImg"}/>
                    <div dangerouslySetInnerHTML={{__html: imgCaptionHTML}} className={"lessImgTxt"}/>
                    <div dangerouslySetInnerHTML={{__html: afterHTML}} className={"lessTxt"}/>
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
                <br></br>
                <button className={"mc-button"} onClick={() => {
                    this.props.changePage("courselist", this.props.currCourse, 0)}}>Back to the Main Page
                </button>

                <br></br>

                <button className={"mc-button"} style={{display: 0 <= this.props.currLesson - 1 ? "inline" : "none"}}
                        onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, Number(this.props.currLesson) - 1);
                        window.focus(); window.scrollTo(0, this.props.currLesson.clientHeight);}} >Prev Lesson
                </button>

                <button className={"mc-button"} style={{display: this.props.numLessons > this.props.currLesson + 1 ? "inline" : "none"}}
                        disabled={(this.props.userStatus.status["c" + this.props.currCourse + "_l" + this.props.currLesson] !== "2" && this.props.user !== "admin")} onClick={() => {
                            this.props.changePage("lesson", this.props.currCourse, Number(this.props.currLesson) + 1);
                            window.scrollTo(0, this.props.currLesson.clientHeight);}}>Next Lesson
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
                                  user={this.props.user} userStatus={this.props.userStatus}/>

                <div className={"lessonBody"}>
                    {this.props.courses[this.props.currCourse].lessonList[this.props.currLesson].lessonElements.map(
                        element => {
                            return element.problem ?
                                <Problem key={this.props.currLesson + " " + element.id} element={element}
                                         currCourse={this.props.currCourse } currLesson={this.props.currLesson}
                                         user={this.props.user} getUserStatus={this.props.getUserStatus}
                                         userStatus={this.props.userStatus}/> :
                                <TextElement key={this.props.currLesson + " " + element.id} element={element}/>
                        }
                    )}
                </div>

                <LessonNavigation numLessons={numLessons} currLesson={this.props.currLesson}
                                  currCourse={this.props.currCourse} changePage={this.props.changePage}
                                  user={this.props.user} userStatus={this.props.userStatus}/>
            </div>
        );
    }
}