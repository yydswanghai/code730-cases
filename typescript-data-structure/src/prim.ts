class ChartNode {
    constructor(
        public value: any,
        public neighbor: ChartNode[] = [],
    ){}
}

let max = Number.MAX_VALUE;
const pointSet = [
    new ChartNode('A'),
    new ChartNode('B'),
    new ChartNode('C'),
    new ChartNode('D'),
    new ChartNode('E')];
const distance = [
    [0, 4, 7, max, max],
    [4, 0, 8, 6, max],
    [7, 8, 0, 5, max],
    [max, 6, 5, 0, 7],
    [max, max, max, 7, 0]
];
function getIndex(str: string) {
    for (let i = 0; i < pointSet.length; i++) {
        if(str == pointSet[i].value) return i;
    }
    return -1;
}

/**
 * 根据当前已经有的节点，进行判断，获取到距离最短的点
 * @param pointSet 点集合
 * @param distance 边集合
 * @param nowPointSet 已经连接到的点集合
 */
function getMinDisNode(pointSet: ChartNode[], distance: number[][], nowPointSet: ChartNode[]) {
    let fromNode: ChartNode | null = null;// 线段的起点
    let minDisNode: ChartNode | null = null;// 线段的终点
    let minDis = max;
    // 根据当前已有的这些点为起点，依次判断连接其他的点的距离是多少
    for (let i = 0; i < nowPointSet.length; i++) {
        const nowPointIndex = getIndex(nowPointSet[i].value);// 当前节点的序号
        // 循环当前节点对应的一阶
        for (let j = 0; j < distance[nowPointIndex].length; j++) {
            const thisNode = pointSet[j];// 表示distance中的点
            if(!nowPointSet.includes(thisNode) && // 这个点不能是已经连接点数组中的点
            distance[nowPointIndex][j] < minDis){ // 其次点之间的距离得是目前的最短距离
                fromNode = nowPointSet[i];
                minDisNode = thisNode;
                minDis = distance[nowPointIndex][j];
            }
        }
    }
    minDisNode && fromNode?.neighbor.push(minDisNode);
    fromNode && minDisNode?.neighbor.push(fromNode);
    return minDisNode;
}

/**
 * 普里姆算法
 * @param pointSet 点集合
 * @param distance 边集合
 * @param start 起始点
 */
function prim(pointSet: ChartNode[], distance: number[][], start: ChartNode) {
    let nowPointSet: ChartNode[] = [];
    nowPointSet.push(start);
    // 获取最小代价的边
    while (true) {
        const minDisNode = getMinDisNode(pointSet, distance, nowPointSet);
        minDisNode && nowPointSet.push(minDisNode);
        if(nowPointSet.length == pointSet.length){
            break;
        }
    }
}

prim(pointSet, distance, pointSet[2]);
console.log(pointSet)

export default {}