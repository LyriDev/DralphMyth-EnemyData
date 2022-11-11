//const main=document.getElementById("main")//書き換えるHTMLのエリア
const tableArea=document.getElementById("tableArea")//書き換えるHTMLのエリア

/* 種別リスト */
const elementList=["火","氷","風","土","雷","水","光","闇","無"]
const attackTypeList=["物理","息","魔法"]

/* 関数等 */
function convertNull(value){//値がnullなら"？"として返す関数
    if(value===null){
        return "？"
    }else{
        return value
    }
}

function addHtmlTag(tagName,content){//受け取った中身をHTMLのタグで挟む関数
    return `<${tagName}>${convertNull(content)}</${tagName}>`
}