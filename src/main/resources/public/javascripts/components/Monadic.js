/* The main component for the Monadic website. By default, this component renders the Regsiter component, but can also
   load the login page, and can load the other two main components, Content and User.
 */
class Monadic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: "register"};
        this.changePage = this.changePage.bind(this);
    }

    changePage(newpage) {
        // update current page string and current course/lesson indices
        this.setState({page: newpage});
    }

    render() {
        if (this.state.page === "register") {
            return (
                <Register changePage={this.changePage}/>
            );
        } else if (this.state.page === "login") {
            return (
                <Login changePage={this.changePage}/>
            );
        } else if (this.state.page === "user") {
            return (<User/>);
        } else if (this.state.page === "content") {
            return (<Content/>);
        }
    }
}