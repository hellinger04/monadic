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


/* var myCodeMirror = CodeMirror(document.body, {
     value: "function myScript(){return 100;}\n",
     mode:  "javascript"
 });*/
