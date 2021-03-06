// This class displays a directory of available courses, and provides buttons which link to them
class CourseDirectory extends React.Component {
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
                        list.push(<button className={"home-button"} key={currKey} onClick={() => {
                            this.props.toLesson(currCourse, currLesson)
                        }}>
                            Lesson {currLesson}: <em>Completed</em></button>);
                    } else if (avail === 1) {
                        list.push(<button className={"home-button"} key={currKey} onClick={() => {
                            this.props.toLesson(currCourse, currLesson)
                        }}>
                            Lesson {currLesson}: <em>Available</em></button>);
                    } else if (avail === 2) {
                        list.push(<button className={"home-button"} key={currKey}
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

//this class is responsible for changing the password
class PassChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "button"};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //check for correct server response
    validatePassword(response) {
        if (response.status === 401) {
            alert("Invalid current password!")
        } else if (response.status === 200) {
            this.setState({page: "success"});//if successful, change page
        }
    }

    //parse form data submission
    handleSubmit(event) {
        event.preventDefault();
        let data = new FormData(event.target);

        const user = this.props.user;
        const oldPass = data.get("OldPassword");
        const newPass1 = data.get("NewPassword");
        const newPass2 = data.get("NewPassword2");

        //init posted data
        const data2 = {
            OldPassword: oldPass,
            NewPassword: newPass1,
            Username: user
        };

        //convert to JSON
        let dataJSON = JSON.stringify(data2);

        if (newPass1 !== newPass2) {
            alert("New passwords don't match!");
        } else if (oldPass === newPass1) {
            alert("New password can't be the same as the old password!");
        } else if (newPass1.length < 8) {
            alert("New password must be at least 8 characters!");
        } else {
            fetch('/users/password', {
                method: 'POST',
                body: dataJSON,
            }).then((function(response) { this.validatePassword(response) }).bind(this));
        }
    }

    render() {
        if (this.state.page === "button") {
            return(
                <div>
                    <button className={"home-button"} onClick={() => {this.setState({ page: "change"})}}> Change Password </button>
                </div>
            );
        } else if (this.state.page === "change") {
            return(
                <div>
                    <form onSubmit={this.handleSubmit} className={"rForm"}>
                        <span className={"passChangeLine"}>Old Password</span>
                        <br/>
                        <label>
                            <input type="password" name="OldPassword" placeholder={"Old Password"}/>
                        </label>

                        <p/>
                        <span className={"passChangeLine"}>New Password</span>
                        <br/>
                        <label>
                            <input type="password" name="NewPassword" placeholder={"New Password"}/>
                        </label>

                        <p/>
                        <span className={"passChangeLine"}>Repeat New Password</span>
                        <br/>
                        <label>
                            <input type="password" name="NewPassword2" placeholder={"New Password"}/>
                        </label>

                        <p/>
                        <span id="errorSpan" style={{color:"red"}}/>
                        <p/>
                        <input className={"home-button"} type="submit" value="Submit Change" />
                    </form>
                    <p/>
                    <button className={"home-button"} onClick={() => {this.setState({ page: "button"})}}> Go Back </button>
                </div>
            );
        } else if (this.state.page === "success") {
            setTimeout(
                function() {
                    this.setState({page: "button"});
                }
                    .bind(this),
                3000
            );
            return(
                <div>
                    <h2 className={"leftSuccess"}> Successfully Changed! </h2>
                </div>
            )
        }

    }
}

//this class serves as a wrapper for navigating the directory and user pages after logging in
class Dashboard extends React.Component {
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
          <div className={"dashboardWrap"}>

              <div> </div>

              <div className={"leftWrap"}>

                  <div>
                      <h1 className={"sp1"}>
                          ようこそ、<em>{this.props.user}</em>！ <br></br>
                          コースを選択してください。
                      </h1>

                      <h2 className={"sp2"}> Welcome, <em>{this.props.user}</em>! <br></br>
                          Please choose a course.
                      </h2>
                  </div>

                  <div className={"leftInWrap"}>

                      <PassChange user={this.props.user}/>

                      <div>
                          <button className={"home-button"} onClick={() => {this.props.logOut()}}> Log Out </button>
                      </div>
                  </div>

              </div>

              <div>
                  <CourseDirectory userStatus={this.props.userStatus} courses={this.props.courses} toLesson={this.toLesson}
                           user={this.props.user}/>
              </div>

              <div> </div>
          </div>
        );
    }
}

/* The main Home component. This component keeps track of state throughout courses and lessons, and defines the
   changePage() function used in subcomponents to change states and navigate through the pages. When this component
   mounts, it initiates a GET request from the Server to obtain information about all available courses.
 */
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "home", currCourse: 0, currLesson: 0, courses: [], userStatus: []};
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
    async getUserStatus(currElement) {
        //get list of courses
        await this.setState({ courses: await (await fetch("/courses")).json() });

        //get user status
        await fetch('/users/getUserStatus', {
            method: 'POST',
            body: this.props.user,
        }).then(this.status).then(this.json).then(function(data) {
            this.setState({userStatus: data});}.bind(this));
    }

    async componentDidMount() {
        this.getUserStatus();
    }

    changePage(newpage, course, lesson) {
        // update current page string and current course/lesson indices
        this.setState({page: newpage});
        this.setState({currCourse: course});
        this.setState({currLesson: lesson});
        this.getUserStatus();
    }

    render() {
        //to prevent undefined errors
        if (this.state.userStatus == null) {
            return null;
        }
        if (this.state.courses == null) {
            return null;
        }

        if (this.state.page === "home") {
            return (
                <Dashboard changePage={this.changePage} courses={this.state.courses}
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