class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "dashboard"};
        this.changePage = this.changePage.bind(this);
    }

    async componentDidMount() {
        this.setState({ courses: await (await fetch("/courses")).json() });
    }

    changePage(newpage, course, lesson) {
        // update current page string
        this.setState({page: newpage});
    }


    render() {
        if (this.state.page === "dashboard") {
            return (
                <EarthBound>
                    <Format>
                        <Title>Welcome User!</Title>
                        <h2>Your Picture Here</h2>
                        <CourseList changePage={this.changePage} courses={this.state.courses}
                                    currCourse={this.state.currCourse}/>
                    </Format>
                </EarthBound>
            );
        }
    }
}