/* 種別リスト */
const elementList=["火","氷","風","土","雷","水","光","闇","無"]
const attackTypeList=["物理","息","魔法"]


/* 関数等 */
function addHtmlTag(tagName,content){//受け取った中身をHTMLのタグで挟む
    return `<${tagName}>${content}</${tagName}>`
}

function convertNull(value){//値がnullなら"？"として返す
    if(value===null){
        return "？"
    }else{
        return value
    }
}