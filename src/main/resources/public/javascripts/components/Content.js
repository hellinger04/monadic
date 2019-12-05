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

// This class displays a directory of available courses, and provides buttons which link to them
class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {completion: 0.0}
    }

    genList() {
        let list = [];

        //sort array of lessons by course and lesson
        const ordered = {};
        const orderedKeys = Object.keys(this.props.userStatus).sort();
        for (let i = 0; i < orderedKeys.length; i++) {
            ordered[orderedKeys[i]] = this.props.userStatus[orderedKeys[i]];
        }

        //push each lesson to list of lessons
        let prevCourse = -1;
        let avail = 0;
        let completeCount = 0;
        let furtherCompletion = true;
        for (let i = 0; i < Object.keys(ordered).length; i++) {
            let currKey = Object.keys(ordered)[i];
            let currCourse = Number(currKey.substr(1,1));
            let currLesson = Number(currKey.substr(4,1));

            //generate course headings
            if (prevCourse !== currCourse) {
                list.push(<h2 className={"spC"}> Course {currCourse}</h2>);
                prevCourse = currCourse
            }

            //logic for availability
            if (avail === 0 && ordered[currKey] !== 2) {
                avail = 1;
            } else if (avail === 1) {
                avail = 2;
            }

            //if current lesson is not started or is in progress, disqualify any future lesson from being complete
            if (ordered[currKey] === 0 || ordered[currKey] === 1) {
                furtherCompletion = false;
            } else if (furtherCompletion && ordered[currKey] === 2) {
                completeCount++;
            }

            //push to list
            if (avail === 0) {
                list.push(<button className={"spB"} key={i} onClick={() => {this.props.toLesson(currCourse,currLesson)}}>
                    Lesson {currLesson}: <em>Completed</em></button>);
            } else if (avail === 1) {
                list.push(<button className={"spB"} key={i} onClick={() => {this.props.toLesson(currCourse,currLesson)}}>
                    Lesson {currLesson}: <em>Available</em></button>);
            } else if (avail === 2) {
                list.push(<button className={"spB"} key={i} disabled={true}>Lesson {currLesson}: <em>Unavailable</em></button>);
            }
        }

        this.state.completion = (completeCount / Object.keys(ordered).length) * 100 ;

        return list;
    }

    render() {
        return (
            <div>
                <h1 className={"spRightHeader"} >Lessons</h1>
                <NoBullet>
                    {this.genList()}
                </NoBullet>

                <br></br> <br></br>

                <span className={"spC"}> <progress max={100} value={this.state.completion}> </progress> {Math.round(this.state.completion * 100) / 100}%</span>
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
                  <button onClick={() => {this.toUser()}}> Profile </button>
                  <button onClick={() => {this.props.logOut()}}> Log Out </button>
              </div>

              <div>
                  <Listing userStatus={this.props.userStatus} courses={this.props.courses} toLesson={this.toLesson}/>
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
        return response.json()
    }

    //get status of user's courses progression
    getUserStatus() {
        fetch('/users/getUserStatus', {
            method: 'POST',
            body: this.props.user,
        }).then(this.status).then(this.json).then(function(data) {
            this.setState({userStatus: data});}.bind(this));

        console.log("Got updated lesson userStatus!");
    }

    async componentDidMount() {
        //get list of courses
        await this.setState({ courses: await (await fetch("/courses")).json() });

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
        if (this.state.userStatus.length === 0) {
            console.log("userStatus length is 0");
            return null;
        }
        if (this.state.courses.length === 0) {
            console.log("courses length is 0");
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
                <Space>
                    <LessonBack>
                        <Lesson changePage={this.changePage} courses={this.state.courses} user={this.props.user}
                                currCourse={this.state.currCourse} currLesson={this.state.currLesson}
                                getUserStatus={this.getUserStatus}/>
                    </LessonBack>
                </Space>
            );
        }
    }
}