const getDataFromServer = async () => {
    const response = await fetch("/courses");
    const dataFromServer = await response.json();
    const Header = () => <h1>Monadic</h1>
    const NextButton = () => <button>next</button>

    class CourseList extends React.Component {
        render() {
            return <ul>{dataFromServer.map(course => <Course course={course}/>)}</ul>;
        }
    }

    class Course extends React.Component {
        render() {
            return (
                <li key={this.props.course.id}> {
                    <form>
                        {console.log("in course")}
                        <button onClick={() =>
                            console.log("hello world")}>
                            Try course: {this.props.course.id}
                        </button>
                        <p>
                            {console.log(this.props.course.id)}
                        </p>
                    </form>
                } </li>
            );
        }
    }


    class Application extends React.Component {
        render() {
            return (
                <div>
                    <Header/>
                    <CourseList/>
                    <NextButton/>
                </div>
            )
        }
    }

    ReactDOM.render(
        <Application/>,
        document.querySelector("#application")
    )
    //we can't be like todoose and let people update lessons by sending
    //requests to the server, but later we will want to update people's
    //answer boxes every so often so we should still have this
    window.setTimeout(() => {getDataFromServer(); }, 200);
    //also note: button should be fetch click () => arrow fuction too keep it from
    //running every 200 ms
};
getDataFromServer();
