class Application extends React.Component {
    render() {
        return (
            <div>
                <Monadic/>
                <TextBox/>
            </div>
        )
    }
}

ReactDOM.render(
    <Application/>,
    document.querySelector("#application")
)
