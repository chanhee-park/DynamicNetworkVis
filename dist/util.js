var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 시각화 외적인 기능을 계산하고 처리하는 유틸리티
var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "loadFile",

    /**
     * 파일을 불러온다.
     * @method loadFile
     * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
     * @returns {string} 불러온 파일의 responseText
     */
    value: function loadFile(filePath) {
      var result = null;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", filePath, false);
      xmlhttp.send();
      if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
      }
      return result;
    }

    /**
     * svg를 생성하고 리턴한다. 
     * @param {string} id id 스트링 (eg. 'my_container')
     */

  }, {
    key: "generateSVG",
    value: function generateSVG(id) {
      var container = d3.select("#" + id);
      var bBox = container.node().getBoundingClientRect();
      var svgW = bBox.width - 2 * PADDING_FOR_SECTION;
      var svgH = bBox.height - 2 * PADDING_FOR_SECTION;

      return container.append("svg").attr("width", svgW).attr("height", svgH);
    }
  }, {
    key: "getParentIdOfReactComp",
    value: function getParentIdOfReactComp(ReactComp) {
      return ReactDOM.findDOMNode(ReactComp).parentNode.getAttribute('id');
    }

    /**
     * 최소 값을 찾는다. 
     * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
     */

  }, {
    key: "min",
    value: function min(arrayLike) {
      var min = +Infinity;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = arrayLike[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (isNaN(item)) continue;
          min = Math.min(min, item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return isFinite(min) ? min : -1;
    }

    /**
    * 최대 값을 찾는다.
    * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
    */

  }, {
    key: "max",
    value: function max(arrayLike) {
      var max = -Infinity;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = arrayLike[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (isNaN(item)) continue;
          max = Math.max(max, item);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return isFinite(max) ? max : -1;
    }

    /**
    * 최대 값과 최소 값을 찾는다.
    * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
    */

  }, {
    key: "minmax",
    value: function minmax(arrayLike) {
      var min = +Infinity;
      var max = -Infinity;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = arrayLike[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          if (isNaN(item)) continue;
          min = Math.min(min, item);
          max = Math.max(max, item);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return [isFinite(min) ? min : -1, isFinite(max) ? max : -1];
    }

    /**
     * Normalize 2D Array. 2차원 배열을 정규화 한다.
     * nmin = 0 이고 nmax = 100 일 때, 배열의 값이 0 ~ 100 사이로 변환된다.
     * arr2d: (min, max) => ret: (nmin, nmax)
     * @param {number[]} arr2d 정규화할 2차원 배열
     * @param {number} nmin 정규화될 범위 최소값
     * @param {number} nmax 정규화될 범위 최대값
     * @returns {number[]} (nmin, nmax)로 정규화된 2차원 배열
     */

  }, {
    key: "normalize2d",
    value: function normalize2d(arr2d) {
      var nmin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var nmax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

      var arr1d = arr2d.flat();
      var min = Math.min.apply(Math, _toConsumableArray(arr1d));
      var max = Math.max.apply(Math, _toConsumableArray(arr1d));
      var sub = max - min;
      var rat = nmax - nmin;
      return arr2d.map(function (r) {
        return r.map(function (v) {
          return (v - min) / sub * rat + nmin;
        });
      });
    }

    // 표준화

  }, {
    key: "standardize2d",
    value: function standardize2d(arr2d) {
      var arr1d = arr2d.flat();
      var avg = Util.average(arr1d);
      var std = Util.standardDeviation(arr1d);
      return arr2d.map(function (row) {
        return row.map(function (val) {
          return (val - avg) / std;
        });
      });
    }

    // 합계 


    // 평균

  }, {
    key: "standardDeviation",


    // 표준편차
    value: function standardDeviation(arr1d) {
      var avg = Util.average(arr1d);
      var squareDiffs = arr1d.map(function (e) {
        return Math.pow(e - avg, 2);
      });
      var avgSquareDiff = Util.average(squareDiffs);
      return Math.sqrt(avgSquareDiff);
    }

    /**
    * 두개의 Set 객체를 비교한다.
    * @param {Set} pre 
    * @param {Set} post
    */

  }, {
    key: "compareSets",
    value: function compareSets(pre, post) {
      var common = new Set(); // It will be a intersection of two sets.
      var preOnly = new Set();
      var postOnly = new Set();

      var union = new Set([].concat(_toConsumableArray(pre), _toConsumableArray(post))); // Get Union of two sets.
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = union[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var e = _step4.value;

          if (pre.has(e) && post.has(e)) {
            common.add(e);
          } else if (pre.has(e)) {
            preOnly.add(e);
          } else if (post.has(e)) {
            postOnly.add(e);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return { preOnly: preOnly, postOnly: postOnly, common: common };
    }

    // 행렬 곱하기

  }, {
    key: "multiplyMatrix",
    value: function multiplyMatrix(a, b) {
      var aNumRows = a.length,
          aNumCols = a[0].length,
          bNumRows = b.length,
          bNumCols = b[0].length,
          m = new Array(aNumRows); // initialize array of rows

      for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
          m[r][c] = 0; // initialize the current cell
          for (var i = 0; i < aNumCols; ++i) {
            m[r][c] += a[r][i] * b[i][c];
          }
        }
      }

      return m;
    }

    // Collection Transpose 

  }, {
    key: "transposeCollection",
    value: function transposeCollection(collection) {
      var keys = Object.keys(collection[0]);
      var ret = {};
      keys.forEach(function (k) {
        return ret[k] = [];
      });
      collection.forEach(function (obj) {
        for (var key in obj) {
          ret[key].push(obj[key]);
        }
      });
      return ret;
    }

    /**
     * PCA 차원축소
     * @param {number[]} arr2d row에 instances, colunm에 attributes 값을 담는 2차원 배열
     * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
     */

  }, {
    key: "pca",
    value: function pca(arr2d) {
      var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

      // package: https://cdn.jsdelivr.net/npm/pca-js@1.0.0/pca.min.js
      var pcaRes = PCA.getEigenVectors(arr2d);
      return pcaRes.map(function (e) {
        return e.vector.slice(0, dimensions);
      });
    }

    /**
     * MDS 차원축소
     * @param {number[]} distances 2차원 인접행렬
     * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
     */

  }, {
    key: "mds",
    value: function mds(distances) {
      var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

      // square distances
      var M = numeric.mul(-.5, numeric.pow(distances, 2));

      // double centre the rows/columns
      function mean(A) {
        return numeric.div(numeric.add.apply(null, A), A.length);
      }
      var rowMeans = mean(M),
          colMeans = mean(numeric.transpose(M)),
          totalMean = mean(rowMeans);

      for (var i = 0; i < M.length; ++i) {
        for (var j = 0; j < M[0].length; ++j) {
          M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
      }

      // take the SVD of the double centred matrix, and return the points from it
      var ret = numeric.svd(M),
          eigenValues = numeric.sqrt(ret.S);

      return ret.U.map(function (row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
      });
    }
  }]);

  return Util;
}();

Util.sum = function (v) {
  return v.reduce(function (s, e) {
    return s + e;
  }, 0);
};

Util.average = function (v) {
  return Util.sum(v) / v.length;
};