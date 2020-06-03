var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 2020.06.03 타임라인 제거 이전
var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      selectedNodes: []
    };
    _this.addSelectedNode = _this.addSelectedNode.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'addSelectedNode',
    value: function addSelectedNode(selectedNode) {
      var addedList = [].concat(_toConsumableArray(this.state.selectedNodes), [selectedNode]);
      this.setState({
        selectedNodes: addedList
      });
    }
  }, {
    key: 'print',
    value: function print() {
      console.log('-- APP --');
      console.log('data:', this.data);
      console.log('netw:', this.network);
      console.log('visu:', this.visualizations);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'app' },
        React.createElement(
          'div',
          { className: 'container-group top' },
          React.createElement(
            'div',
            { className: 'container',
              id: 'timeline-container' },
            React.createElement(Timeline, { network: this.props.network })
          )
        ),
        React.createElement(Tooltip, { text: 'Network is Changed' }),
        React.createElement(
          'div',
          { className: 'container-group body' },
          React.createElement(
            'div',
            { className: 'container',
              id: 'scatter-container' },
            React.createElement(ScatterPlot, { network: this.props.network })
          ),
          React.createElement(
            'div',
            { className: 'container',
              id: 'parallel-container' },
            React.createElement(PCoold, { network: this.props.network })
          )
        ),
        React.createElement(
          'div',
          { className: 'container-group bottom' },
          React.createElement(
            'div',
            { className: 'container-wrapper',
              id: 'smalls-container-wrapper' },
            React.createElement(
              'div',
              { className: 'container',
                id: 'smalls-container' },
              React.createElement(Smalls, { network: this.props.network,
                nodeClickHandler: this.addSelectedNode })
            )
          ),
          React.createElement(
            'div',
            { className: 'container-wrapper',
              id: 'table-container-wrapper' },
            React.createElement(
              'div',
              { className: 'container',
                id: 'table-container' },
              React.createElement(NodeTable, { nodes: this.state.selectedNodes })
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

var ts = testsets[3];
var data = new Dataset(ts.url, ts.idxs, ts.sep);
var network = Dataset.getNetwork(data, 1);

ReactDOM.render(React.createElement(App, { network: network }), document.getElementById('root'));