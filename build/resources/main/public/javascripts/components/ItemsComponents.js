class PlusButton extends React.Component {
    handleClick() {
        fetch("/items", { method: "POST" });
    }

    render() {
        return <button className={this.props.className} onClick={() => { this.handleClick(); }}>+</button>;
    }
}

class ItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [] };
    }

    async getDataFromServer() {
        this.setState({ items: await (await fetch("/items")).json() });
        window.setTimeout(() => { this.getDataFromServer(); }, 200);
    }

    componentDidMount() {
        this.getDataFromServer();
    }

    render() {
        return <ul>{this.state.items.map(item => <Item key={item.identifier} item={item}/>)}</ul>;
    }
}

class Item extends React.Component {
    render() {
        return (
            <li>
                <MarkItemAsDoneCheckbox item={this.props.item}/>
                <ItemDescription item={this.props.item}/>
            </li>
        );
    }
}

class MarkItemAsDoneCheckbox extends React.Component {
    handleChange() {
        fetch(`/items/${this.props.item.identifier}`, { method: "DELETE" });
    }

    render() {
        return <input type="checkbox" onChange={() => { this.handleChange(); } } />
    }
}

class ItemDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = null;
    }

    handleFocus() {
        this.setState({ description: this.props.item.description });
    }

    handleChange(event) {
        this.setState({ description: event.target.value });
    }

    async handleBlur() {
        const formData = new FormData();
        formData.append("description", this.state.description);
        await fetch(`/items/${this.props.item.identifier}`, { method: "PUT", body: formData });
        this.setState(null);
    }

    render() {
        return (
            <input
                type="text"
                name="description"
                autoComplete="off"
                value={this.state === null ? this.props.item.description : this.state.description}
                onFocus={() => { this.handleFocus(); }}
                onChange={event => { this.handleChange(event); }}
                onBlur={() => { this.handleBlur(); }}
            />
        );
    }
}
