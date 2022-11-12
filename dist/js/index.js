function createEnemyElement(index,name,level,tag){//表示する敵データの要素を作成する関数
    return `
        <div class="data">
            <div class="name">${convertNull(name)}</div>
            <div class="level">Lv${convertNull(level)}</div>
            <div class="tag">${convertNull(tag)}</div>
            <div class="button">
                <button class="editButton" onclick="location.href='${viewUrl}?index=${index}'" >閲覧</button>
                <button class="editButton" onclick="location.href='${editUrl}?index=${index}'" >編集</button>
            </div>
        </div>
    `
}
function getEnemyDataByTag(data,tagName){//指定されたタグに合致する敵データを取得する関数
    let result=""
    $.each(data.enemy,function(index,value){
        if(tagName===value.tag){
            result+=createEnemyElement(index,value.name,value.level,value.tag)
        }
    })
    return result
}
function getAllEnemyTag(data){//敵データの全タグ種を取得する関数
    let enemyTagList=new Array
    $.each(data.enemy,function(index,value){
        if(!enemyTagList.includes(value.tag)){
            enemyTagList.push(value.tag)
        }
    })
    return enemyTagList
}
function showEnemyData(data,filter=null){//表示する敵データを作成する関数
    let result=""
    if(filter===null){//フィルターなしのとき
        let allEnemyTag=getAllEnemyTag(data)
        for(let i in allEnemyTag){//タグ毎にデータをまとめて出力する
            result+=getEnemyDataByTag(data,allEnemyTag[i])
        }
    }else{//フィルターありのとき
        for(let i in filter){//指定されたタグ毎にデータをまとめて出力する
            result+=getEnemyDataByTag(data,filter[i])
        }
    }
    mainArea.innerHTML=result//表の中身を変更する
}

function updatecreateButton(index){//"新規作成"ボタンで移動するリンク先を更新する関数
    document.getElementById("createButtonArea").innerHTML=`
    <button id="createButton" onclick="location.href='${editUrl}?index=${index}'; return false">新規作成</button>
    `
}

/* ここから実際の処理 */
$(function(){
    $.ajax({
        url:"./data.json",//jsonファイルの場所
        dataType:"json",// json形式でデータを取得
    })
    .done(function(data){
        updatecreateButton(data.enemy.length)//"新規作成"ボタンで移動するリンク先を更新する
        showEnemyData(data)//全部のデータを表示する
    })
})