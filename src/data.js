const testsets = [
  {
    url: './dataset/copresence-InVS13/copresence-InVS13.edges',
    idxs: [0, 1, 2],
  },
  {
    url: './dataset/insecta-ant-colony6/insecta-ant-colony6.edges',
    idxs: [0, 1, 3],
  }
];

class Dataset {
  /**
   * Dataset 객체를 생성한다.
   * @param {boolean} isUrlFile 두번째 매개변수인 파일이 URL 형식으로 주어젔는지 표시
   * @param {string} file 스트링으로 구성된 파일(eg. csv, tsv, ssv) 또는 URL
   * @param {string} sep 주어진 파일의 구분자(Separator)
   * @param {number[]} idxs 주어진 파일에서 [노드1, 노드2, 시간]에 대한 컬럼 인덱스
   */
  constructor(file, idxs = [0, 1, 2], sep = ' ', isUrlFile = true) {
    this.txt = isUrlFile ? Util.loadFile(file) : file;
    this.sep = sep;
    this.node1Idx = typeof idxs !== undefined ? idxs[0] : 0;
    this.node2Idx = typeof idxs !== undefined ? idxs[1] : 1;
    this.timeIdx = typeof idxs !== undefined ? idxs[2] : 2;
  }

  print () {
    console.log('-- Dataset --');
    console.log('txt: ', this.txt);
    console.log(`sep: '${this.sep}'`);
    console.log('idx: ', this.node1Idx, this.node2Idx, this.timeIdx);
  }

  /**
   * 
   * @param {Dataset} dataset 네트워크를 생성할 데이터셋
   * @param {number} probability 링크가 필터링 될 확률 (0 < p < 1)
   */
  static getNetwork (dataset, probability = 1) {
    const txt = dataset.txt;
    const sep = dataset.sep;
    const n1Idx = dataset.node1Idx;
    const n2Idx = dataset.node2Idx;
    const tiIdx = dataset.timeIdx;

    const nodes = new Set();
    const links = new Set();
    const times = new Set();
    const lines = txt.split('\n');
    for (let line of lines) {
      // probability 확률로 링크를 필터링 합니다.
      if (Math.random() > probability) continue;

      const elems = line.split(sep);
      const from = parseInt(elems[n1Idx]);
      const to = parseInt(elems[n2Idx]);
      const time = parseInt(elems[tiIdx]);

      // from_node, to_node, 그리고 time 중 하나라도 NaN인 경우 패스합니다.
      if (isNaN(from + to + time)) continue;

      nodes.add(from).add(to);
      times.add(time);
      links.add(new Link(from, to, time));
    }

    return new Network(nodes, links, times);
  }
}
