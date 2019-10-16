const Header = () => <h1>Monadic</h1>

class Application extends React.Component {
    render() {
        return (
            <div>
                <Header/>
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
