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
                            <NoBullet>
                                <li>Lesson 0: {this.state.status.zero_0}</li>
                            </NoBullet>
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