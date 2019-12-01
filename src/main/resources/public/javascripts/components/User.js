class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "dashboard"};
        this.changePage = this.changePage.bind(this);
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
        fetch('/users/status', {
            method: 'POST',
            body: this.props.user,
        }).then(this.status).then(this.json).then(function(data) {
                this.setState({status: data});}.bind(this));
    }

    changePage(newpage) {
        // update current page string
        this.setState({page: newpage});
    }

    createList() {
        let list = [];
        const lessonStatus = Object.freeze({0:"not started", 1:"in progress", 2:"completed"});

        //sort array of lessons by course and lesson
        const ordered = {};
        const orderedKeys = Object.keys(this.state.status).sort();
        for (let i = 0; i < orderedKeys.length; i++) {
            ordered[orderedKeys[i]] = this.state.status[orderedKeys[i]];
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
            console.log(this.state.status);
            if (typeof this.state.status !== 'undefined') {
                return (
                    <EarthBound>
                        <Format>
                            <Title>{this.props.user}'s profile</Title>
                            <h2>{this.props.user}'s picture here</h2>
                            <h3>Course 0</h3>
                            <ul><NoBullet>
                                {this.createList()}
                                {/*<li>Lesson 0: {this.state.status.c0_l0}</li>*/}
                            </NoBullet></ul>
                        </Format>
                    </EarthBound>
                );
            } else {
                return (
                    <EarthBound>
                        <Format>
                            <Title>{this.props.user}'s profile</Title>
                            <h2>{this.props.user}'s picture here</h2>
                        </Format>
                    </EarthBound>
                );
            }
        }
    }
}