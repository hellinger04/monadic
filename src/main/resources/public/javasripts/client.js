class Application extends React.Component {
    render() {
        return (
            <div>
                <PlusButton className="plus-at-the-top"/>
                <Header/>
                <ItemList/>
                <PlusButton className="plus-at-the-bottom"/>
            </div>
        );
    }
}

const Header = () => (
    <header>
        <h1>MONADIC</h1>
        <p><small>A <a href="https://github.com/jhu-oose/2019-group-monadic">monad tutorial application</a> for <a href="https://www.monadic.com">OOSE</a></small></p>
    </header>
);

ReactDOM.render(<Application/>, document.querySelector("#application"));
