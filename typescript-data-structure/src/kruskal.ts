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
/**
 * 判断两点是否可以连接
 */
function canLink(resultList: ChartNode[][], tempBegin: ChartNode, tempEnd: ChartNode) {
    let beginIn: any = null;// 起始点
    let endIn: any = null;// 结束点
    for (let i = 0; i < resultList.length; i++) {
        if(resultList[i].includes(tempBegin)){// 部落里是否有这个临时起始点
            beginIn = resultList[i];
        }
        if(resultList[i].includes(tempEnd)){// 部落里是否有这个临时结束点
            endIn = resultList[i];
        }
    }
    // 两个点都是新的点，都不在任何部落里 —— 可以连接
    // begin在A部落，end没有部落 —— 可以连接
    // end在A部落，begin没有部落 —— 可以连接
    // begin在A部落，end在B部落 —— 可以连接
    // begin和end在同一个部落 —— 不可以连接
    if(beginIn != null && endIn != null && beginIn == endIn){
        return false;
    }
    return true;
}
/**
 * 连接
 */
function link(resultList: any[][], tempBegin: ChartNode, tempEnd: ChartNode) {
    let beginIn: ChartNode[] | null = null;// 起始点
    let endIn: ChartNode[] | null = null;// 结束点
    for (let i = 0; i < resultList.length; i++) {
        if(resultList[i].includes(tempBegin)){// 部落里是否有这个临时起始点
            beginIn = resultList[i];
        }
        if(resultList[i].includes(tempEnd)){// 部落里是否有这个临时结束点
            endIn = resultList[i];
        }
    }

    if(beginIn == null && endIn == null){// 两个点都是新的点，都不在任何部落里 —— 可以连接
        const newArr: ChartNode[] = [];
        newArr.push(tempBegin);
        newArr.push(tempEnd);
        resultList.push(newArr);
    }else if(beginIn != null && endIn == null){// begin在A部落，end没有部落 —— 可以连接
        beginIn.push(tempEnd);
    }else if(beginIn == null && endIn != null){// end在A部落，begin没有部落 —— 可以连接
        endIn.push(tempBegin);
    }else if(beginIn != null && endIn != null && beginIn != endIn){// begin在A部落，end在B部落 —— 可以连接
        const allIn = beginIn.concat(endIn);
        let index = resultList.indexOf(endIn);
        resultList.splice(index, 1);
        index = resultList.indexOf(beginIn);
        resultList.splice(index, 1);
        resultList.push(allIn);
    }
    // 连接tempBegin、tempEnd
    tempBegin.neighbor.push(tempEnd);
    tempEnd.neighbor.push(tempBegin);
}
/**
 * 克鲁斯卡尔算法
 */
function kruskal(pointSet: ChartNode[], distance: number[][]) {
    const resultList: ChartNode[][] = [];// 这里是二维数组，此数组代表点是有多少个"部落"，至少两个点被连接起来就形成了一个部落

    while (true) {
        let minDis = max;// 连接两点的最小距离
        let begin: ChartNode | null = null;// 起始点
        let end: ChartNode | null = null;// 结束点
        for (let i = 0; i < distance.length; i++) {
            for (let j = 0; j < distance[i].length; j++) {
                let tempBegin = pointSet[i];// 临时起始点
                let tempEnd = pointSet[j];// 临时结束点
                // 去掉自己到自己的距离，因为都为0
                if(i != j && distance[i][j] < minDis && canLink(resultList, tempBegin, tempEnd)){
                    // 如果可以连接
                    minDis = distance[i][j];
                    begin = tempBegin;
                    end = tempEnd;
                }
            }
        }
        link(resultList, begin!, end!);
        // 只有一个部落，且这个部落里的村庄数和所有村庄数相等
        if(resultList.length == 1 && resultList[0].length == pointSet.length){
            break;
        }
    }
}

kruskal(pointSet, distance);
console.log(pointSet);

export default {}