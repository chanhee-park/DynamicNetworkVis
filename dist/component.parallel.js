var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PCoold = function (_React$Component) {
  _inherits(PCoold, _React$Component);

  function PCoold(props) {
    _classCallCheck(this, PCoold);

    var _this = _possibleConstructorReturn(this, (PCoold.__proto__ || Object.getPrototypeOf(PCoold)).call(this, props));

    _this.svg = Util.getSVG(_this.props.containerId);
    _this.networks = _this.props.network.subNetworks;
    _this.statsByNetwork = Network.getStatisticsFromNetworks(_this.networks);
    _this.statsByKey = Util.transposeCollection(_this.statsByNetwork);
    console.log(_this);
    return _this;
  }

  _createClass(PCoold, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      PCoold.drawPCoold(this.svg, this.stats);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      PCoold.drawPCoold(this.svg, this.stats);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", { id: "#" + this.props.id });
    }
  }], [{
    key: "drawPCoold",
    value: function drawPCoold(svg, stats) {
      return;
    }
  }]);

  return PCoold;
}(React.Component);