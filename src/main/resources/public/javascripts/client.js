class Application extends React.Component {
    render() {
        return (
            <div>
                <Monadic/>
            </div>
        )
    }
}

ReactDOM.render(
    <Application/>,
    document.querySelector("#application")
)
