class TreeNode {
    constructor(
        public value: any,
        public left: TreeNode | null = null,
        public right: TreeNode | null = null
    ){}
}

// 获取二叉树的深度
function getDeep(root: TreeNode) {
    if(root == null) return 0;
    const leftDeep = getDeep(root.left!);
    const rightDeep = getDeep(root.right!);
    return Math.max(leftDeep, rightDeep) + 1;
}
/**
 * 判断是否为一颗平衡二叉树
 */
function isBalance(root: TreeNode) {
    if(root == null) return true;
    const leftDeep = getDeep(root.left!);
    const rightDeep = getDeep(root.right!);
    if(Math.abs(leftDeep - rightDeep) > 1){// 不平衡
        return false;
    }else{
        return isBalance(root.left!) && isBalance(root.right!)
    }
}
/**
 * 返回平衡之后的根节点
 */
function change(root: TreeNode) {
    if(isBalance(root)) return root;
    if(root.left != null) root.left = change(root.left);
    if(root.right != null) root.right = change(root.right);
    const leftDeep = getDeep(root.left!);
    const rightDeep = getDeep(root.right!);
    if(Math.abs(leftDeep - rightDeep) < 2){
        return root;
    }else if(leftDeep > rightDeep){// 不平衡，左边深，需要右旋
        const changeTree = getDeep(root.left?.right!);// 变化分支
        const noChangeTree = getDeep(root.left?.left!);// 不变分支
        if(changeTree > noChangeTree){// 当变化分支嵌套比较深
            root.left = leftRotate(root.left);// 左子树先左转
        }
        let newRoot = rightRotate(root);
        newRoot.right = change(newRoot.right);// 对右侧分支再平衡
        newRoot = change(newRoot);// 然后对自身平衡
        return newRoot;
    }else{// 不平衡，右边深，需要左旋
        const changeTree = getDeep(root.right?.left!);// 变化分支
        const noChangeTree = getDeep(root.right?.right!);// 不变分支
        if(changeTree > noChangeTree){// 当变化分支嵌套比较深
            root.right = rightRotate(root.right);// 右子树先右转
        }
        let newRoot = leftRotate(root);
        newRoot.left = change(newRoot.left);
        newRoot = change(newRoot);
        return newRoot;
    }
}
function leftRotate(root) {
    const newRoot = root.right;// 1.找到新根
    const changeTree = root.right.left;// 2.找到变化分支
    root.right = changeTree;// 3.当前旋转节点的右子树为变化分支
    newRoot.left = root;// 4.新根的左子树为旋转节点
    return newRoot;// 5.返回新的根节点
}
function rightRotate(root) {
    const newRoot = root.left;// 1.找到新根
    const changeTree = root.left.right;// 2.找到变化分支
    root.left = changeTree;// 3.当前旋转节点的左子树为变化分支
    newRoot.right = root;// 4.新根的右子树为旋转节点
    return newRoot;// 5.返回新的根节点
}

let num = 0;// 计算比较了多少次
function searchByTree(root: TreeNode, target) {
    num++;
    if(root == null) return false;
    if(root.value == target) return true;
    if(root.value > target) return searchByTree(root.left!, target);
    else return searchByTree(root.right!, target);
}
function addNode(root: TreeNode, num: number) {
    if(root == null) return;
    if(root.value == num) return;
    if(root.value < num){// 目标值比当前节点大
        if(root.right == null){
            root.right = new TreeNode(num);
        }else{
            addNode(root.right, num);
        }
    }else{// 目标值比当前节点小
        if(root.left == null){
            root.left = new TreeNode(num);
        }else{
            addNode(root.left, num);
        }
    }
}
function buildSearchTree(arr: number[]) {
    if(arr == null || arr.length == 0) return null;
    var root = new TreeNode(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        addNode(root, arr[i]);
    }
    return root;
}
function buildArray(arr: any[], num: number) {
    for (let i = 0; i < num; i++) {
        arr[i] = Math.floor(Math.random() * 1000);
    }
    return arr;
}
const arr: number[]= buildArray([], 1000);
const root = buildSearchTree(arr) as TreeNode;
const targetNum = 880;

console.log(arr, arr.includes(targetNum));
console.log(searchByTree(root, targetNum));
console.log(num);

const newRoot = change(root);
num = 0;
console.log(searchByTree(newRoot, targetNum));
console.log(num);

export default {}