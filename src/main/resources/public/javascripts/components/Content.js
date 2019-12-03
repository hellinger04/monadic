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

class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        //debug
        console.log(this.props.courses);

        return(
          <div className={"splashWrap"}>
              <div>
                  <h1> Welcome, <em>dipshit</em>. <br></br>
                      Look around if you want.
                  </h1>
              </div>

              <div>
                  <Course changePage={this.props.changePage} courses={this.props.courses}
                          currCourse={0} currLesson={0}/>
              </div>
          </div>
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
        this.state = {page: "course", currCourse: 0, currLesson: 0, courses: []};
        this.changePage = this.changePage.bind(this);
    }

    async componentDidMount() {
        //get list of courses
        this.setState({ courses: await (await fetch("/courses")).json() });
    }

    changePage(newpage, course, lesson) {
        // update current page string and current course/lesson indices
        this.setState({page: newpage});
        this.setState({currCourse: course});
        this.setState({currLesson: lesson});

        //some debug shit
        console.log("Here's where I am: ");
        console.log(newpage);
        console.log(course);
        console.log(lesson);
    }

    render() {

        console.log("test1");
        console.log(this.state.courses);
        if (this.state.page === "courselist") {
            return (
                <Splash changePange={this.changePage} courses={this.state.courses}
                    status={this.state.status} user={this.state.user}/>
            );

                    {/*// <EarthBound>*/}
                    {/*//     <Format>*/}
                    {/*//         <Title>Welcome, {this.props.user}!</Title>*/}
                    {/*//         <button onClick={() => {this.changePage("user")}}>View Profile</button>*/}
                    {/*//*/}
                    {/*//         <br/>*/}
                    {/*//         <br/>*/}
                    {/*//*/}
                    {/*//         <h2>Available Courses</h2>*/}
                    {/*//         <CourseList changePage={this.changePage} courses={this.state.courses}*/}
                    {/*//                     currCourse={this.state.currCourse}/>*/}
                    {/*//     </Format>*/}
                    {/*//     <div>*/}
                    {/*//         <button onClick={() => {this.props.logOut()}}> Log Out </button>*/}
                    {/*//     </div>*/}
                    {/*// </EarthBound>*/}

        } else if (this.state.page === "user") {
            return (
                <User changePage={this.changePage} user={this.props.user}/>
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