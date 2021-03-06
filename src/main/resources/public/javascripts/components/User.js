class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "dashboard"};
        // this.changePage = this.changePage.bind(this);
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


    async componentDidMount() {
        fetch('/users/getUserStatus', {
            method: 'POST',
            body: this.props.user,
        }).then(this.status).then(this.json).then(function(data) {
                this.setState({userStatus: data});}.bind(this));
    }

    createList() {
        let list = [];
        const lessonStatus = Object.freeze({0:"not started", 1:"in progress", 2:"completed"});

        //sort array of lessons by course and lesson
        const ordered = {};
        const orderedKeys = Object.keys(this.state.userStatus).sort();
        for (let i = 0; i < orderedKeys.length; i++) {
            ordered[orderedKeys[i]] = this.state.userStatus[orderedKeys[i]];
        }

        //push each lesson to list of lessons
        for (let i = 0; i < Object.keys(ordered).length; i++) {
            let currKey = Object.keys(ordered)[i];
            let currCourse = currKey.substr(1,1);
            let currLesson = currKey.substr(4,1);
            list.push(<li key={i}>Course {currCourse}, Lesson {currLesson}: {lessonStatus[ordered[currKey]]}</li>);
        }
        return list;
    }

    render() {
        if (this.state.page === "dashboard") {
            if (typeof this.state.userStatus !== 'undefined') {
                return (
                    <div className={"earthBound"}>
                        <div className={"format"}>
                            <h1 className={"title"}>{this.props.user}'s profile</h1>
                            <img src={"/img/default-profile.png"} alt={"Profile Picture"}/>
                            <h1>Lesson Progress</h1>
                            <div className={"noBullet"}>
                                {this.createList()}
                            </div>
                            <button onClick={() => {this.props.changePage("home", 0, 0)}}> Go Back </button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className={"earthBound"}>
                        <div className={"format"}>
                            <h1 className={"title"}>{this.props.user}'s profile</h1>
                            <h2>{this.props.user}'s picture here</h2>
                            <button onClick={() => {this.props.changePage("home", 0, 0)}}> Go Back </button>
                        </div>
                    </div>
                );
            }

        }
    }
}