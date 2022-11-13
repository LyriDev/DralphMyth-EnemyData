/* 全ページで使用する共通の宣言など */
const mainArea=document.getElementById("main")//書き換えるHTMLのエリア
const htmlUrl=window.location.href//index.htmlのパス
function getQuery(name){//クエリ文字列(URLパラメータ)を取得する関数
    name=name.replace(/[\[\]]/g,"\\$&");
    const regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),
        results=regex.exec(htmlUrl)
    if(!results){return null}
    if(!results[2]){return ''}
    return decodeURIComponent(results[2].replace(/\+/g," "))
}
const page=getQuery("page")//開いているページの種類
const index=getQuery("index")//開いているページの項目
let jsonData//取得するjsonのデータ

function convertNull(value,alt="？"){//値がnullなら"？"として返す関数
    if(value===null){
        return alt
    }else{
        return value
    }
}



/* ページごとに表示するコンテンツを変更するための関数 */

function updateHeader(_page=page){//ヘッダーを変更する関数
    let result
    switch (_page){
        case null://一覧ページのヘッダー
            result=`
            <form>
                <input type="text" id="searchText" placeholder="タグ検索">
                <div id="headerButtonArea"> </div>
            </form>
            `//新規作成ボタンは後でindexを変更する仕様
            break
        case "view"://閲覧ページのヘッダー
            result=`
            <form>
                <div id="headerButtonArea">
                    <button id="headerButton" onclick="location.href='./index.html?page=edit&index=${index}'; return false">編集</button>
                    <button id="headerButton" onclick="location.href='./index.html'; return false">一覧</button>
                </div>
            </form>
            `
            $("#styleSwitch").attr("href","./css/view.css" )
            break
        case "edit"://編集ページのヘッダー
            result=`
            <form>
                <div id="headerButtonArea">
                    <button id="headerButton" onclick="location.href='./index.html?page=view&index=${index}'; return false">閲覧</button>
                    <button id="saveButton" onclick="; return false">保存</button>
                </div>
            </form>
            `//TODO 保存ボタンのonclick処理
            $("#styleSwitch").attr("href","./css/edit.css" )
            break
    }
    document.getElementById("header").innerHTML=result
}

function updateMain(_page=page){//メインを変更する関数

}

/* 一覧ページを表示中に使う関数 */
function createEnemyElement(index,name,level,tag){//表示する敵データの要素を作成する関数
    return `
        <div class="data">
            <div class="name">${convertNull(name)}</div>
            <div class="level">Lv${convertNull(level,"?")}</div>
            <div class="tag">${convertNull(tag,"")}</div>
            <div class="button">
                <button class="editButton" onclick="location.href='./index.html?page=view&index=${index}'" >閲覧</button>
                <button class="editButton" onclick="location.href='./index.html?page=edit&index=${index}'" >編集</button>
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
function showEnemyData(data,filter=""){//表示する敵データを作成する関数
    let result=""
    if(filter===""){//フィルターなしのとき
        let allEnemyTag=getAllEnemyTag(data)
        for(let i in allEnemyTag){//タグ毎にデータをまとめて出力する
            result+=getEnemyDataByTag(data,allEnemyTag[i])
        }
    }else{//フィルターありのとき
        result+=getEnemyDataByTag(data,filter)//指定されたタグを持つデータのみを出力する
    }
    mainArea.innerHTML=result//表の中身を変更する
}


/* ヘッダー関連の処理 */
const filterByTag=function(){//#headerButtonAreaのonイベントに設定するための関数
    const filter=$("#searchText").val()//検索ボックスに入力された値
    showEnemyData(jsonData,filter)//敵データにフィルターをかけて表示する
}

function updatecreateButton(index){//"新規作成"ボタンで移動するリンク先を更新する関数
    document.getElementById("headerButtonArea").innerHTML=`
    <button id="headerButton" onclick="location.href='./index.html?page=edit&index=${index}'; return false">新規作成</button>
    `
}

/* ここから実際の処理 */
updateHeader()//ページごとにヘッダーを更新する
$(function(){
    $.ajax({
        url:"./data.json",//jsonファイルの場所
        dataType:"json",// json形式でデータを取得
    })
    .done(function(data){
        jsonData=data
        if(page===null){//一覧ページの際の処理
            $("#searchText").on("input",filterByTag)//検索するための処理を検索ボックスに適用する
            showEnemyData(jsonData)//全部のデータを表示する
            updatecreateButton(jsonData.enemy.length)//"新規作成"ボタンで移動するリンク先を更新する
        }else{

        }
    })
})