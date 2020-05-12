// 시각화 외적인 기능을 계산하고 처리하는 유틸리티
class Util {
  /**
   * 파일을 불러온다.
   * @method loadFile
   * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
   * @returns {string} 불러온 파일의 responseText
   */
  static loadFile (filePath) {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
  }

  /**
   * svg를 생성하고 리턴한다. 
   * @param {string} selector 선택자 스트링 (eg. '#my_container')
   */
  static getSVG (selector) {
    const container = d3.select(selector);
    const containerBBox = container.node().getBoundingClientRect();
    const svgW = containerBBox.width - 2 * PADDING_FOR_SECTION;
    const svgH = containerBBox.height - 2 * PADDING_FOR_SECTION;

    return container.append("svg")
      .attr("width", svgW)
      .attr("height", svgH);
  }

  /**
   * 최소 값을 찾는다. 
   * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
   */
  static min (arrayLike) {
    let min = +Infinity;
    for (let item of arrayLike) {
      if (isNaN(item)) continue;
      min = Math.min(min, item);
    }
    return isFinite(min) ? min : -1
  }

  /**
  * 최대 값을 찾는다.
  * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
  */
  static max (arrayLike) {
    let max = -Infinity;
    for (let item of arrayLike) {
      if (isNaN(item)) continue;
      max = Math.max(max, item);
    }
    return isFinite(max) ? max : -1
  }

  /**
  * 최대 값과 최소 값을 찾는다.
  * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
  */
  static minmax (arrayLike) {
    let min = + Infinity;
    let max = - Infinity;
    for (let item of arrayLike) {
      if (isNaN(item)) continue;
      min = Math.min(min, item);
      max = Math.max(max, item);
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
  static normalize2d (arr2d, nmin = 0, nmax = 100) {
    const arr1d = arr2d.flat();
    const min = Math.min(...arr1d);
    const max = Math.max(...arr1d);
    const sub = max - min;
    const rat = nmax - nmin;
    return arr2d.map(r => r.map(v => ((v - min) / sub) * rat + nmin));
  }

  // 표준화
  static standardize2d (arr2d) {
    const arr1d = arr2d.flat();
    const avg = Util.average(arr1d);
    const std = Util.standardDeviation(arr1d);
    return arr2d.map(row => row.map(val => (val - avg) / std));
  }

  // 합계 
  static sum = v => v.reduce((s, e) => s + e, 0);

  // 평균
  static average = v => Util.sum(v) / v.length;

  // 표준편차
  static standardDeviation (arr1d) {
    const avg = Util.average(arr1d);
    const squareDiffs = arr1d.map(e => Math.pow(e - avg, 2));
    const avgSquareDiff = Util.average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  /**
  * 두개의 Set 객체를 비교한다.
  * @param {Set} pre 
  * @param {Set} post
  */
  static compareSets (pre, post) {
    const common = new Set(); // It will be a intersection of two sets.
    const preOnly = new Set();
    const postOnly = new Set();

    const union = new Set([...pre, ...post]); // Get Union of two sets.
    for (let e of union) {
      if (pre.has(e) && post.has(e)) {
        common.add(e);
      } else if (pre.has(e)) {
        preOnly.add(e);
      } else if (post.has(e)) {
        postOnly.add(e);
      }
    }
    return { preOnly, postOnly, common }
  }

  // 행렬 곱하기
  static multiplyMatrix (a, b) {
    const aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows

    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }

    return m;
  }

  // Collection Transpose 
  static transposeCollection (collection) {
    const keys = Object.keys(collection[0]);
    const ret = {};
    keys.forEach(k => ret[k] = []);
    collection.forEach(obj => {
      for (let key in obj) {
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
  static pca (arr2d, dimensions = 2) {
    // package: https://cdn.jsdelivr.net/npm/pca-js@1.0.0/pca.min.js
    const pcaRes = PCA.getEigenVectors(arr2d);
    return pcaRes.map(e => e.vector.slice(0, dimensions))
  }

  /**
   * MDS 차원축소
   * @param {number[]} distances 2차원 인접행렬
   * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
   */
  static mds (distances, dimensions = 2) {
    // square distances
    const M = numeric.mul(-.5, numeric.pow(distances, 2));

    // double centre the rows/columns
    function mean (A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    const rowMeans = mean(M),
      colMeans = mean(numeric.transpose(M)),
      totalMean = mean(rowMeans);

    for (let i = 0; i < M.length; ++i) {
      for (let j = 0; j < M[0].length; ++j) {
        M[i][j] += totalMean - rowMeans[i] - colMeans[j];
      }
    }

    // take the SVD of the double centred matrix, and return the points from it
    const ret = numeric.svd(M),
      eigenValues = numeric.sqrt(ret.S);

    return ret.U.map(function (row) {
      return numeric.mul(row, eigenValues).splice(0, dimensions);
    });
  }
}
