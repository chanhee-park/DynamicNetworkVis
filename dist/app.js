var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { "class": "app" },
        React.createElement(
          "div",
          { "class": "container-group top" },
          React.createElement(
            "div",
            { "class": "container",
              id: "timeline-container" },
            React.createElement(Timeline, { network: this.props.network })
          ),
          React.createElement(
            "div",
            { id: "tooltip",
              "class": "hidden" },
            React.createElement(
              "p",
              null,
              React.createElement(
                "strong",
                null,
                "Network is changed"
              )
            ),
            React.createElement(
              "p",
              null,
              React.createElement(
                "span",
                { id: "value" },
                "-"
              )
            )
          )
        ),
        React.createElement(
          "div",
          { "class": "container-group body" },
          React.createElement(
            "div",
            { "class": "container",
              id: "scatter-container" },
            React.createElement(ScatterPlot, { network: this.props.network })
          ),
          React.createElement(
            "div",
            { "class": "container",
              id: "parallel-container" },
            React.createElement(PCoold, { network: this.props.network })
          )
        ),
        React.createElement(
          "div",
          { "class": "container-group bottom" },
          React.createElement(
            "div",
            { "class": "container-wrapper",
              id: "smalls-container-wrapper" },
            React.createElement(
              "div",
              { "class": "container",
                id: "smalls-container" },
              React.createElement(Smalls, { network: this.props.network })
            )
          ),
          React.createElement("div", { "class": "container",
            id: "table-container" })
        )
      );
    }
  }, {
    key: "print",
    value: function print() {
      console.log('-- APP --');
      console.log('data:', this.data);
      console.log('netw:', this.network);
      console.log('visu:', this.visualizations);
    }

    // start () {
    //   this.updateVis();
    // }

    // updateVis () {
    //   Object.entries(this.visualizations).forEach(([key, vis]) => {
    //     const container = document.querySelector(`#${key}-container`);
    //     ReactDOM.render(vis, container);
    //   });
    // }

  }]);

  return App;
}(React.Component);

var ts = testsets[3];
var data = new Dataset(ts.url, ts.idxs, ts.sep);
var network = Dataset.getNetwork(data, 1);

ReactDOM.render(React.createElement(App, { network: network }), document.getElementById('root'));