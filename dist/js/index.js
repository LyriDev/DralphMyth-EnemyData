const drawArea=document.getElementById("main")//書き換えるHTMLのエリア

/* 種別リスト */
const elementList=["火","氷","風","土","雷","水","光","闇","無"]
const attackTypeList=["物理","息","魔法"]



/* HTMLの書き換え処理 */
function addHtmlTag(tagName,content){//受け取った中身をタグで挟む
    return `<${tagName}>${content}</${tagName}>`
}
function convertNull(value){//値がnullなら"？"として返す
    if(value===null){
        return "？"
    }else{
        return value
    }
}

/* function showAll(data){
    drawArea.innerHTML=""//描画エリアを初期化する
    $.each(data.enemy,function(key,value){//データ分だけ処理を行う
        drawArea.innerHTML+=convertNull(value.name)+":"+convertNull(value.statusEffects.flame)+"<br>"
    })
} */

function showName(data){
    drawArea.innerHTML=""//描画エリアを初期化する
    $.each(data.enemy,function(key,value){//データ分だけ処理を行う
        drawArea.innerHTML+=convertNull(value.name)+":"+convertNull(value.statusEffects.flame)+"<br>"
    })
}

/* ここから実際の処理 */
$(function(){
    $.ajax({
        url:"./data.json",//jsonファイルの場所
        dataType:"json",// json形式でデータを取得
    })

    .done(function(data){
        //showName(data)//全部のデータを表示する
    })
})