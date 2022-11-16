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

function convertNull(value,alt="？"){//値がnullなら"？"として返す関数
    if(value===null){
        return alt
    }else{
        return value
    }
}

/* 種別リスト */
const elementList=["火","氷","風","土","雷","水","光","闇","無"]
const attackTypeList=["物理","息","魔法"]

/* ページごとに表示するコンテンツを変更するための関数 */
function updateHTML(data){//HTMLを更新する関数
    switchCssFile()//読み込むCSSファイルを差し替える
    updateHeader(data)//ヘッダーを更新する
    updateMain(data)//メインを更新する
}

function switchCssFile(_page=page){//ページ毎に読み込むCSSファイルを変更する関数
    let cssUrl//cssファイルのパス
    switch(_page){
        case null://一覧ページ
            cssUrl="./css/index.css"
            break
        case "view"://閲覧ページ
            cssUrl="./css/view.css"
            break
        case "edit"://編集ページ
            cssUrl="./css/edit.css"
            break
        default:
            break
    }
    $("#styleSwitch").attr("href",cssUrl)//CSSファイルを差し替える
}

function updateHeader(data,_page=page){//ヘッダーを変更する関数
    let result
    switch (_page){
        case null://一覧ページのヘッダー
            result=`
            <div id="headerContent">
                <input type="text" id="searchText" placeholder="タグ検索">
                <div id="headerButtonArea">
                    <button id="headerButton">新規作成</button>
                </div>
            </div>
            `
            $(document).on("click","#headerButton",function(){//閲覧ボタンに処理を適用する
                addJsonData(data)//jsonファイルに新しいデータを追加する
                location.href=`./index.html?page=edit&index=${data.enemy.length}`
            })
            break
        case "view"://閲覧ページのヘッダー
            result=`
            <div id="headerContent">
                <div id="headerButtonArea">
                    <button id="headerButton" onclick="location.href='./index.html?page=edit&index=${index}'">編集</button>
                    <button id="headerButton" onclick="location.href='./index.html'">一覧</button>
                </div>
            </div id="headerContent">
            `
            break
        case "edit"://編集ページのヘッダー
            result=`
            <div id="headerContent">
                <div id="headerButtonArea">
                    <button id="headerButton">閲覧</button>
                    <button id="saveButton">保存</button>
                </div>
            </div>
            `
            $(document).on("click","#headerButton",function(){//閲覧ボタンに処理を適用する
                saveJson()//jsonファイルを上書き更新する
                location.href=`./index.html?page=view&index=${index}`
            })
            $(document).on("click","#saveButton",function(){//保存ボタンに処理を適用する
                alert("保存しました")
                saveJson()//jsonファイルを上書き更新する
            })
            break
    }
    document.getElementById("header").innerHTML=result
}

function updateMain(data,_page=page){//メインを変更する関数
    switch(_page){
        case null://一覧ページの際の処理
            updateSearchText(data)//検索するための処理を検索ボックスに適用する
            updateMainContent(showEnemyData(data))//全部のデータを表示する
            break
        case "view":
            updateMainContent(viewEnemyData(data))//閲覧ページの中身でmainAreaを上書きする
            updateAllTextarea()//textareaの初期値に合わせて高さを自動調整する
        default:
            break
    }
}

function updateMainContent(content){//メインの中身を上書きする関数
    mainArea.innerHTML=content//メインの中身を変更する
}

/* 一覧ページを表示中に使う関数 */
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
function getEnemyDataByTag(data,tagName){//指定されたタグに合致する敵データを取得する関数
    let result=""
    $.each(data.enemy,function(key,value){
        if(tagName===value.tag){
            result+=createEnemyElement(key,value.name,value.level,value.tag)
        }
    })
    return result
}
function createEnemyElement(key,name,level,tag){//表示する敵データの要素を作成する関数
    return `
        <div class="data">
            <div class="name">${convertNull(name)}</div>
            <div class="level">Lv${convertNull(level,"?")}</div>
            <div class="tag">${convertNull(tag,"")}</div>
            <div class="button">
                <button class="editButton" onclick="location.href='./index.html?page=view&index=${key}'" >閲覧</button>
                <button class="editButton" onclick="location.href='./index.html?page=edit&index=${key}'" >編集</button>
            </div>
        </div>
    `
}

function addJsonData(data){
//TODO jsonにデータを追加する処理
}

/* 閲覧ページを表示中に使う関数 */
function viewEnemyData(data){
    // &#10005; バツ
    let result= `
        <div id="name">ミ＝ゴ&nbsp;Lv5</div>
        <div id="tag">道中敵</div>
        <div class="parameterBox">
            <div>属性<br>氷</div>
            <div>種族<br>虫系</div>
            <div>SANチェック<br>0/1d6</div>
        </div>
        <div class="parameterBox">
            <div>HP<br>800</div>
            <div>装甲<br>12</div>
            <div>イニシアチブ<br>16</div>
            <div>行動P<br>4</div>
            <div>回避<br>100%</div>
            <div>行動回数<br>2回</div>
        </div>
        <table class="statusEffectTable">
            <tr>
                <th>炎</th>
                <th>氷</th>
                <th>幻惑</th>
                <th>眠り</th>
                <th>混乱</th>
                <th>スタン</th>
                <th>呪い</th>
                <th>隠密</th>
            </tr>
            <tr>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
                <td>&#9675;</td>
            </tr>
        </table>
        <table class="statusEffectTable">
            <tr>
                <th>攻撃力低下</th>
                <th>物理防御力低下</th>
                <th>息防御力低下</th>
                <th>魔法防御力低下</th>
            </tr>
            <tr>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
                <td>100%</td>
            </tr>
        </table>
        <div class="cardBox">
            <div class="cardHeader">
                <p class="cardHeaderTitle">特性</p>
                <a class="cardHeaderIcon">
                    <span class="arrowDown">a</span>
                </a>
            </div>
            <div class="cardBody">
                <div class="cardTable">
                    <div class="cardTable-abilityName">
                        <div class="cardTableTitle">特性名</div>
                        <input readonly type="text" class="cardTableContent" value="連鎖">
                    </div>
                    <div class="cardTable-abilityEffect">
                        <div class="cardTableTitle">効果</div>
                        <textarea readonly id="textarea0" class="cardTableContent" rows="1">雷攻撃が命中時に発動、その命中した敵の中心に３×３マスにいる敵に命中する。(連鎖した敵には連鎖判定は発生しない)</textarea>
                    </div>
                </div>
                <div class="cardTable">
                    <div class="cardTable-abilityName">
                        <div class="cardTableTitle">特性名</div>
                        <input readonly type="text" class="cardTableContent" value="貫通">
                    </div>
                    <div class="cardTable-abilityEffect">
                        <div class="cardTableTitle">効果</div>
                        <textarea readonly id="textarea1" class="cardTableContent" rows="1">「電気ライフル」の攻撃時のみ発動、対象に命中するまでに通ったマスにいる敵にも命中する。</textarea>
                    </div>
                </div>
                <div class="cardTable">
                    <div class="cardTable-abilityName">
                        <div class="cardTableTitle">特性名</div>
                        <input readonly type="text" class="cardTableContent" value="連鎖">
                    </div>
                    <div class="cardTable-abilityEffect">
                        <div class="cardTableTitle">効果</div>
                        <textarea readonly id="textarea2" class="cardTableContent" rows="1">雷攻撃が命中時に発動</textarea>
                    </div>
                </div>
            </div>
        </div>
    `
    return result
}
function updateAllTextarea(){//全てのtextareaの初期値に合わせてそれぞれ高さを自動調整する関数
    const textareaList = $('textarea[id^="textarea"]');
    for(let i=0;i<textareaList.length;i++){
        updateTextarea(`#textarea${i}`)
    }
}
function updateTextarea(textareaId){//textareaの初期値に合わせて高さを自動調整する関数
    $(function() {
        const targetArea = $(textareaId);
        const rawTarget = targetArea.get(0);
        let lineHeight = Number(targetArea.attr("rows"));
        while (rawTarget.scrollHeight > rawTarget.offsetHeight){
            lineHeight++;
            targetArea.attr("rows", lineHeight);
        }
    });
}

/* 編集ページを表示中に使う関数 */
function saveJson(){//更新されたjsonファイルを保存する関数
//TODO jsonファイルを上書き更新する
}

/* ヘッダー関連の処理 */
function updateSearchText(data){////検索するための処理を検索ボックスに適用する関数
    $("#searchText").on("input",function(){
        const filter=$("#searchText").val()//検索ボックスに入力された値
        showEnemyData(data,filter)//敵データにフィルターをかけて表示する
    })
}

/* ここから実際の処理 */
$(function(){
    $.ajax({
        url:"./data.json",//jsonファイルの場所
        dataType:"json",// json形式でデータを取得
    })
    .done(function(data){
        updateHTML(data)//HTMLを更新する
    })
})