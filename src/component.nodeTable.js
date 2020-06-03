class NodeTable extends React.Component {
  // TODO: Talbe -> LineUp
  constructor(props) {
    super(props);
  }

  render () {
    if (this.props.nodes.length < 1) {
      return (
        <table className='nodeTable' >
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      );
    }
    const head =
      <tr>
        {Object.keys(this.props.nodes[0]).map(key => <th>{key}</th>)}
      </tr>;
    const rows = this.props.nodes.map((node) =>
      <tr>
        {Object.values(node).map(val => <td>{val}</td>)}
      </tr>
    );
    console.log(head, rows);
    return (
      <table className="nodeTable">
        {head}
        {rows}
      </table>
    );
  }
}