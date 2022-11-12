function createEnemyElement(name,level,tag){//表示する敵データの要素を作成する関数
    return `
        <div class="data">
            <div class="name">${name}</div>
            <div class="level">Lv${level}</div>
            <div class="tag">${tag}</div>
            <div class="button">
                <input class="viewButton" type="button" value="閲覧">
                <input class="editButton" type="button" value="編集">
            </div>
        </div>
    `
}
function getEnemyDataByTag(data,tagName){//指定されたタグに合致する敵データを取得する関数
    let result=""
    $.each(data.enemy,function(key,value){
        if(tagName===value.tag){
            result+=createEnemyElement(value.name,value.level,value.tag)
        }
    })
    return result
}
function getAllEnemyTag(data){//敵データの全タグ種を取得する関数
    let enemyTagList=new Array
    $.each(data.enemy,function(key,value){
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

/* ここから実際の処理 */
$(function(){
    $.ajax({
        url:"./data.json",//jsonファイルの場所
        dataType:"json",// json形式でデータを取得
    })
    .done(function(data){
        showEnemyData(data)//全部のデータを表示する
    })
})