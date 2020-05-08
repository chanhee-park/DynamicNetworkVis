var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App() {
    _classCallCheck(this, App);

    this.data = new Dataset(testsets[0].url, testsets[0].idxs);

    // FIXME: 테스트 속도를 위하여 확률 값을 0.25로 하였음 => 1로 변경 필요.
    this.network = Dataset.getNetwork(this.data, 0.25);

    // React Visualization Objects
    this.visualizations = {

      // 1) timeline
      timeline: React.createElement(Timeline, {
        title: "Network Change Timeline",
        containerId: "#timeline-container",
        network: this.network
      }),

      // 2) scatter plot
      scatter: React.createElement(ScatterPlot, {
        title: "Network Similarity Between The Time",
        containerId: "#scatter-container",
        network: this.network
      })

      // 3) parallel coordinate

      // 4) small multiples of node-link diagram

      // 5) node statistics table

    };

    this.start();
  }

  _createClass(App, [{
    key: "print",
    value: function print() {
      console.log('-- APP --');
      console.log('data:', this.data);
      console.log('netw:', this.network);
      console.log('visu:', this.visualizations);
    }
  }, {
    key: "start",
    value: function start() {
      this.updateVis();
    }
  }, {
    key: "updateVis",
    value: function updateVis() {
      Object.entries(this.visualizations).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            vis = _ref2[1];

        var container = document.querySelector("#" + key + "-container");
        ReactDOM.render(vis, container);
      });
    }
  }]);

  return App;
}();