// This class displays a directory of available courses, and provides buttons which link to them
class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {completion: 0.0};
        this.outerKey = "status";
    }

    genList() {
        try {
            let list = [];
            let numLessons = 0;

            //determine number of lessons
            for (let i = 0; i < this.props.courses.length; i++) {
                numLessons = numLessons + Object.keys(this.props.courses[i].lessonList).length;
            }

            //sort array of lessons by course and lesson
            const ordered = {};
            const orderedKeys = Object.keys(this.props.userStatus.status).sort();
            for (let i = 0; i < numLessons; i++) {
                ordered[orderedKeys[i]] = this.props.userStatus.status[orderedKeys[i]];
            }

            //push each lesson to list of lessons
            let prevCourse = -1;
            let avail = 0;
            let completeCount = 0;
            let furtherCompletion = true;
            for (let i = 0; i < this.props.courses.length; i++) {
                let currKey = "";
                for (let j = 0; j < Object.keys(this.props.courses[i].lessonList).length; j++) {
                    currKey = "c" + i + "_l" + j;
                    let currCourse = i;
                    let currLesson = j;

                    //generate course headings
                    if (prevCourse !== currCourse) {
                        list.push(<h2 className={"spC"} key={currCourse}> Course {currCourse}</h2>);
                        prevCourse = currCourse
                    }

                    //logic for availability
                    if (this.props.user === "admin") {
                        avail = 1;
                    } else if (avail === 0 && ordered[currKey] !== "2") {
                        avail = 1;
                    } else if (avail === 1) {
                        avail = 2;
                    }

                    //if current lesson is not started or is in progress, disqualify any future lesson from being complete
                    if (ordered[currKey] === "0" || ordered[currKey] === "1") {
                        furtherCompletion = false;
                    } else if (furtherCompletion && ordered[currKey] === "2") {
                        completeCount++;
                    }

                    //push to list
                    if (avail === 0) {
                        list.push(<button className={"spB"} key={currKey} onClick={() => {
                            this.props.toLesson(currCourse, currLesson)
                        }}>
                            Lesson {currLesson}: <em>Completed</em></button>);
                    } else if (avail === 1) {
                        list.push(<button className={"spB"} key={currKey} onClick={() => {
                            this.props.toLesson(currCourse, currLesson)
                        }}>
                            Lesson {currLesson}: <em>Available</em></button>);
                    } else if (avail === 2) {
                        list.push(<button className={"spB"} key={currKey}
                                          disabled={true}>Lesson {currLesson}: <em>Unavailable</em></button>);
                    }
                }
            }

            this.state.completion = (completeCount / numLessons) * 100;

            return list;
        } catch (e) {
            return null;
        }
    }

    render() {
        return (
            <div>
                <h1 className={"spRightHeader"} >Lessons</h1>
                <div className={"noBullet"}>
                    {this.genList()}
                </div>

                <br></br> <br></br>

                <div>
                    <h2 className={"spC"}><progress max={100} value={this.state.completion}/>&nbsp;
                        {Math.round(this.state.completion * 100) / 100}% Completed</h2>
                </div>
            </div>
        );
    }
}

//this class serves as a wrapper for navigating the directory and user pages after logging in
class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.toUser = this.toUser.bind(this);
        this.toLesson = this.toLesson.bind(this);
    }

    toUser() {
        this.props.changePage("user", 0, 0);
    }

    toLesson(course, lesson) {
        this.props.changePage("lesson", course, lesson);
    }

    render() {
        return(
          <div className={"splashWrap"}>

              <div></div>

              <div>
                  <h1 className={"sp1"}>
                      ようこそ、<em>{this.props.user}</em>！ <br></br>
                      コースを選択してください。
                  </h1>

                  <h2 className={"sp2"}> Welcome, <em>{this.props.user}</em>! <br></br>
                      Please choose a course.
                  </h2>
                  <button className={"home-button"} onClick={() => {this.toUser()}}> Profile </button>
                  &nbsp; &nbsp;
                  <button className={"home-button"} onClick={() => {this.props.logOut()}}> Log Out </button>
              </div>

              <div>
                  <Listing userStatus={this.props.userStatus} courses={this.props.courses} toLesson={this.toLesson}
                           user={this.props.user}/>
              </div>

              <div></div>
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
        this.state = {page: "courselist", currCourse: 0, currLesson: 0, courses: [], userStatus: []};
        this.changePage = this.changePage.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);
    }

    status(response) {
        if (response.status === 201) {
            return Promise.resolve(response);
        } else if (response.status === 401) {
            return Promise.reject(new Error("That username doesn't exist. Please try refreshing the page and try again."));
        }
    }

    json(response) {
        return response.json();
    }

    //get status of user's courses progression
    async getUserStatus(currElement, convert) {
        //get list of courses
        await this.setState({ courses: await (await fetch("/courses")).json() });

        let data = {
            Username: this.props.user,
            CourseID: this.state.currCourse.toString(),
            LessonID: this.state.currLesson.toString(),
            ElementID: currElement.toString(),
            convertToTypeScript: convert.toString()
        };

        let dataJSON = JSON.stringify(data);

        //get user status
        await fetch('/users/getUserStatus', {
            method: 'POST',
            body: dataJSON,
        }).then(this.status).then(this.json).then(function(data) {
            this.setState({userStatus: data});}.bind(this));
    }

    async componentDidMount() {
        this.getUserStatus(0, false);
    }

    changePage(newpage, course, lesson) {
        // update current page string and current course/lesson indices
        this.setState({page: newpage});
        this.setState({currCourse: course});
        this.setState({currLesson: lesson});
        this.getUserStatus(0, false);
    }

    render() {
        //to prevent undefined errors
        if (this.state.userStatus == null) {
            return null;
        }
        if (this.state.courses == null) {
            return null;
        }

        if (this.state.page === "courselist") {
            return (
                <Splash changePage={this.changePage} courses={this.state.courses}
                    userStatus={this.state.userStatus} user={this.props.user} logOut={this.props.logOut}/>
            );
        } else if (this.state.page === "user") {
            return (
                <User changePage={this.changePage} user={this.props.user}/>
            );
        } else if (this.state.page === "lesson") {
            return (
                <div className={"space"}>
                    <div className={"lessonBack"}>
                        <Lesson changePage={this.changePage} courses={this.state.courses} user={this.props.user}
                                currCourse={this.state.currCourse} currLesson={this.state.currLesson}
                                userStatus={this.state.userStatus} getUserStatus={this.getUserStatus}/>
                    </div>
                </div>
            );
        }
    }
}