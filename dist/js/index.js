const drawArea=document.getElementById("main")//書き換えるHTMLのエリア





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