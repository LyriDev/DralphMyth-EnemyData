const mainArea=document.getElementById("main")//書き換えるHTMLのエリア

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

function addHtmlTag(content,tagName,className=null){//受け取った中身をHTMLのタグで挟む関数
    if(className===null){//クラスを設定しない場合
        return `<${tagName}>${convertNull(content)}</${tagName}>`
    }else{//クラスを設定する場合
        return `<${tagName} class="${className}">${convertNull(content)}</${tagName}>`
    }
}