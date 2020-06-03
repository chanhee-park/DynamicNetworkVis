var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeTable = function (_React$Component) {
  _inherits(NodeTable, _React$Component);

  // TODO: Talbe -> LineUp
  function NodeTable(props) {
    _classCallCheck(this, NodeTable);

    return _possibleConstructorReturn(this, (NodeTable.__proto__ || Object.getPrototypeOf(NodeTable)).call(this, props));
  }

  _createClass(NodeTable, [{
    key: "render",
    value: function render() {
      if (this.props.nodes.length < 1) {
        return React.createElement(
          "table",
          { className: "nodeTable" },
          React.createElement(
            "tr",
            null,
            React.createElement("th", null),
            React.createElement("th", null),
            React.createElement("th", null)
          ),
          React.createElement(
            "tr",
            null,
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement("td", null)
          )
        );
      }
      var head = React.createElement(
        "tr",
        null,
        Object.keys(this.props.nodes[0]).map(function (key) {
          return React.createElement(
            "th",
            null,
            key
          );
        })
      );
      var rows = this.props.nodes.map(function (node) {
        return React.createElement(
          "tr",
          null,
          Object.values(node).map(function (val) {
            return React.createElement(
              "td",
              null,
              val
            );
          })
        );
      });
      console.log(head, rows);
      return React.createElement(
        "table",
        { className: "nodeTable" },
        head,
        rows
      );
    }
  }]);

  return NodeTable;
}(React.Component);