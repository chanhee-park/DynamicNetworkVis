// 시각화 외적인 기능을 계산하고 처리하는 유틸리티
const Util = {
  /**
   * 파일을 불러온다.
   * @method loadFile
   * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
   * @returns {string} 불러온 파일의 responseText
   */
  loadFile: (filePath) => {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
  },

  /**
   * svg를 생성하고 리턴한다. 
   * @param {string} selector 선택자 스트링 (eg. '#my_container')
   */
  getSVG: (selector) => {
    const container = d3.select(selector);
    const containerBBox = container.node().getBoundingClientRect();
    const svgW = containerBBox.width - 2 * PADDING_FOR_SECTION;
    const svgH = containerBBox.height - 2 * PADDING_FOR_SECTION;

    return container.append("svg")
      .attr("width", svgW)
      .attr("height", svgH);
  },

  /**
   * 최소 값을 찾는다. 
   * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
   */
  min: (arrayLike) => {
    let min = +Infinity;
    for (let item of arrayLike) {
      min = Math.min(min, item)
    }
    return isFinite(min) ? min : -1
  },

  /**
  * 최대 값을 찾는다.
  * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
  */
  max: (arrayLike) => {
    let max = -Infinity;
    for (let item of arrayLike) {
      max = Math.max(max, item)
    }
    return isFinite(max) ? max : -1
  },

  /**
  * 두개의 Set 객체를 비교한다.
  * @param {Set} pre 
  * @param {Set} post
  */
  compareSets: (pre, post) => {
    const common = new Set();
    const preOnly = new Set();
    const postOnly = new Set();

    const union = new Set([...pre, ...post]); // Get Union of two sets.
    for (let e of union) {
      if (pre.has(e) && post.has(e)) {
        common.add(e); // It is a intersection of two sets.
      } else if (pre.has(e)) {
        preOnly.add(e);
      } else if (post.has(e)) {
        postOnly.add(e);
      }
    }
    return { preOnly, postOnly, common }
  },

  /**
   * PCA 차원축소
   * @param {number[]} arr2d row에 instances, colunm에 attributes 값을 담는 2차원 배열
   * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
   */
  pca: (arr2d, dimensions = 2) => {
    // package: https://cdn.jsdelivr.net/npm/pca-js@1.0.0/pca.min.js
    const pcaRes = PCA.getEigenVectors(arr2d);
    return pcaRes.map(e => e.vector.slice(0, dimensions))
  },

  /**
   * MDS 차원축소
   * @param {number[]} distances 2차원 인접행렬
   * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
   */
  mds: (distances, dimensions = 2) => {
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
  },
}
