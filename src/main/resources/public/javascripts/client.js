const getDataFromServer = async () => {
    const response = await fetch("/courses");
    const dataFromServer = await response.json()
    ReactDOM.render(
        <div>
            <h1>Monadic</h1>
            <ul>
                {
                    dataFromServer.map(course => <li key={course.id}>{<button onClick={() => console.log("hello world")}>Try course: {course.id}</button>}</li>)
                }
            </ul>
            <button>next</button>
        </div>,
        document.querySelector("#application")
    );
    //we can't be like todoose and let people update lessons by sending
    //requests to the server, but later we will want to update people's
    //answer boxes every so often so we should still have this
    window.setTimeout(() => {getDataFromServer(); }, 200);
    //also note: button should be fetch click () => arrow fuction too keep it from
    //running every 200 ms
};
getDataFromServer();
