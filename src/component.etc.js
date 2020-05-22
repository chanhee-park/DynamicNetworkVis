class Tooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div id="tooltip"
        class="hidden">
        <p><strong>this.props.text</strong></p>
        <p><span id="value">-</span></p>
      </div>
    );
  }
}