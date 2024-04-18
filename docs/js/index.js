/* 全ページで使用する共通の宣言など */
const mainArea=document.getElementById("main")//書き換えるHTMLのエリア
const htmlUrl="./index.html"//htmlのリンク
const pageUrl=window.location.href//今開いているページのパス
function getQuery(name){//クエリ文字列(URLパラメータ)を取得する関数
    name=name.replace(/[\[\]]/g,"\\$&");
    const regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),
        results=regex.exec(pageUrl)
    if(!results){return null}
    if(!results[2]){return ''}
    return decodeURIComponent(results[2].replace(/\+/g," "))
}
const Page=getQuery("page")//開いているページの種類
const Index=getQuery("index")//開いているページの項目
const isOpenList={symbol:true,resistance:true,ability:true,move:true,note:true}//アコーディオンメニューが開いているかどうか
const emptyData={//新規データの枠組み(技・特性欄は空)
    name:"",
    level:"",
    tag:"",
    elements:[
    ],
    species:[
    ],
    sanCheck:{
        success:"",
        failure:""
    },
    HP:"",
    armor:"",
    initiative:"",
    actionPoint:"",
    dodge:"",
    actionNumber:"",
    statusEffects:{
        flame:"",
        ice:"",
        dazzle:"",
        poison:"",
        sleep:"",
        confusion:"",
        stun:"",
        curse:"",
        atkDown:"",
        defDown:{
            physical:"",
            breath:"",
            magic:""
        },
        spdDown:""
    },
    stealth:"",
    abilities:[
    ],
    moves:[
    ],
    note:""
}
const newData={//新規データの枠組み(技・特性欄に空要素を1つ入れたもの)
    name:"",
    level:"",
    tag:"",
    elements:[
    ],
    species:[
    ],
    sanCheck:{
        success:"",
        failure:""
    },
    HP:"",
    armor:"",
    initiative:"",
    actionPoint:"",
    dodge:"",
    actionNumber:"",
    statusEffects:{
        flame:"",
        ice:"",
        dazzle:"",
        poison:"",
        sleep:"",
        confusion:"",
        stun:"",
        curse:"",
        atkDown:"",
        defDown:{
            physical:"",
            breath:"",
            magic:""
        },
        spdDown:""
    },
    stealth:"",
    abilities:[
        {
            name:"",
            effect:""
        }
    ],
    moves:[
        {
            index:"",
            name:"",
            successRate:"",
            types:[
            ],
            elements:[
            ],
            damage:"",
            attackNumber:"",
            reach:"",
            range:"",
            statusEffects:[
            ],
            effects:[
            ]
        }
    ],
    note:""
}
const fileReader=new FileReader()//File API
let firebaseIdToken = null;

function NumberOrEmpty(value){//値が空文字列以外の時はString型をNumber型に変換する関数
    if(value==="")return ""
    return Number(value)
}
function getAmbiguousArrayLength(array){//存在しないかもしれない配列のlengthを返す関数
    try{
        return array.length
    }catch(error){
        return 0
    }
}
function convertProperty(value,target="",alt="?"){//null値などを代替テキストに変換する関数
    if(value===target){
        return alt
    }else{
        return value
    }
}
function convertString(value,target,alt=""){//文字列から特定の文字を変換する関数
    const regularExpression=new RegExp(target,"g")
    let result=""
    result=value.replace(regularExpression,alt)
    return result
}
function convertAvailability(value){//0~100を〇/×に変換する関数
    if(value===100){
        return "&#9675;"//マル
    }else if(value===0){
        return "&#10005;"//バツ
    }else if(typeof value==="number"){
        return "&#9651;"//三角
    }else if(value===""){
        return "&#8722;"
    }else{
        return ""
    }
}
function convertPercent(value,propertyName="",hideUnknown=false,hideEffective=false){//100を有効,0を無効,50を半減に変換する関数
    let result=""
    switch(String(value)){
        case "100":
            if(hideEffective===true){return ""}//「有効」を隠す
            result="有効"
            break
        case "50":
            result="半減"
            break
        case "0":
            result="無効"
            break
        case "":
            if(hideUnknown===true){return ""}//「不明」も隠す
            result="不明"
            break
        default:
            if(Boolean(Number(value))===true){//数値に変換できるかどうか
                if((value>=0)&&(value<=100)){
                    result=`${100-Number(value)}%無効`
                }
            }
            break
    }
    return `${propertyName}${result}`
}
function convertValueToPercent(value){//有効を100,無効を0,半減を50に変換する関数
    let result=""
    switch(value){
        case "有効":
            result=100
            break
        case "半減":
            result=50
            break
        case "無効":
            result=0
            break
        case "不明":
            result=""
            break
        default:
            break
    }
    return result
}
function addDotToArray(array,value){//配列の間に要素を追加して文字列として返す関数
    let result=""
    if(array.length<2){//配列の"間"がないなら処理を終了
        return String(array)
    }
    for(let i=0;i<array.length-1;i++){
        result+=`${array[i]}${value}`
    }
    result+=array[array.length-1]
    return result
}
function addValueToArray(array,value){//配列の値の後ろにそれぞれ要素を追加して返す関数
    let addedArray=new Array
    for(let i in array){
        addedArray.push(`${array[i]}${value}`)
    }
    return addedArray
}
function addValue(value,add,negative,position=1){//値が否定条件に合致しなければ、値の後ろに要素を追加して返す関数
    let result=""
    if(value===negative){
        result=value
    }else{
        if(position===1){//要素を後ろに追加する
            result=`${value}${add}`
        }else if(position===0){//要素を前に追加する
            result=`${add}${value}`
        }
    }
    return result
}
function deleteValueInArray(array,value){//配列から特定の要素を削除する関数
    if(Boolean(array)===false){return ""}//渡された配列が定義されていないなら処理止め
    function recursiveProcess(_array,_Value){//要素を1つ消す
        const result=_array.slice()//引数の配列を値渡しでコピーする
        const arrayIndex = result.indexOf(_Value);
        result.splice(arrayIndex,1)
        return result
    }
    let resultArray=array.slice()//引数の配列を値渡しでコピーする
    while(resultArray.includes(value)===true){//全部消えるまで消す
        resultArray=recursiveProcess(resultArray,value)
    }
    return resultArray
}
function getFinalNumber(array){//受け取った数値型配列に存在しない数値の中での最大値を取得する関数
    let result=null
    let i=0
    while(true){
        if(array.includes(i)===false){
            result=i
            break
        }
        i++
    }
    return result
}
function getTypeArray(array){//数値と空白文字を含む配列から要素の種類を抜き出してソートする関数
    let valueList=new Array//要素の種類を保存する配列
    for(let i in array){
        if(!valueList.includes(array[i])){
            valueList.push(array[i])
        }
    }
    if(valueList.includes("")){//空白文字を含む場合
        valueList=deleteValueInArray(valueList,"")//一旦空白文字を消して、
        valueList=valueList.sort()//ソートして、
        valueList.unshift("")//先頭に消した空白文字を追加する
    }else{//空白文字を含まない場合
        valueList=valueList.sort()
    }
    return valueList

}
function setUrl(idName,url){//クリックしたらurlを開く処理を適用する関数
    $(document).off("click",idName)
    $(document).on("click",idName,function(event){
        //左クリックのときの処理
        if(event.button == 0) location.href=url
    })

    $(document).off("mousedown",idName)
    $(document).on("mousedown",idName,function(event){
        //中クリックのときの処理
        if(event.button == 1) window.open(url,"_blank")
    })
}
function exportToClipboard(value){//テキストデータをクリップボードに出力する関数
    if(navigator.clipboard){//サポートしているかを確認
        navigator.clipboard.writeText(value)//クリップボードに出力
    }
}
function createDataList(dataListId,list){//datalistタグを作成する関数
    if(Array.isArray(list) === false){return}//例外処理
    let result=`<datalist id="${dataListId}">`
    for(let i in list){
        result+=`<option value="${list[i]}">`
    }
    result+="</datalist>"
    return result
}
function stringToHTML(str){//文字列をhtmlの要素に変換する関数
    var dom = document.createElement('div');
    dom.innerHTML = str;
    const domChild=dom.firstElementChild
    return domChild;
}
function escapeRegExp(str){//正規表現で特殊な意味を持つ文字を全てエスケープさせる関数
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
function viewReach(reach,canDiagonal,text="斜め可"){//射程を斜め可付きで取得する関数
    let result=String(reach)
    if(canDiagonal){
        result+=`(${text})`
    }
    return result
}
function checkHaveDisruptiveWave(moves){//いてつく波動のような使うと次ターン終了時まで使えなくなるを持っているかどうか調べる関数
    const checkTemplate="(次の自分のターンが終わるまで再使用しない)"
    const regDisWave=new RegExp(checkTemplate)//非完全一致の正規表現
    let result=false
    for(let i in moves){
        for(let j in moves[i].effects){
            if(moves[i].effects[j].match(regDisWave)){
                result=true
            }
        }
    }
    return result
}
function hideTheZeroProperty(mayZeroProperty,value){//レベルのない状態異常のレベルを隠して取得する関数
    let result=""
    if(mayZeroProperty!==0){
        result=value
    }
    return result
}
function* getUniqueKey(){//一意キーを取得する関数
    let count=0
    while(true){
        yield count.toString(16)
        count++
    }
}
function getDataWithIndex(data){//全データをインデックス付きで取得する関数
    let result={enemy:[]}
    for(let i=0;i<data.enemy.length;i++){
        const enemyData=data.enemy[i]
        enemyData.Index=i
        result.enemy.push(enemyData)
    }
    return result
}
function getDataWithoutNotSavedData(data){//未保存のデータ以外を取得する関数
    let result={enemy:[]}
    for(let i=0;i<data.enemy.length;i++){
        const enemyData=data.enemy[i]
        enemyData.index=i
        if((!enemyData.isNotSaved)&&(!enemyData.founder)){//未保存のデータや仮置きデータでなければ
            result.enemy.push(enemyData)//データを取得する
        }
    }
    return result
}
const uniqueKey=getUniqueKey()//一意キー

/* 種別リスト */
const attackTypeList=[//攻撃種別リスト
    "物理",
    "息",
    "魔法"
]
const speciesList=[//種族リスト
    "人間",
    "亜人",
    "悪魔",
    "ドラゴン",
    "スライム",
    "自然",
    "ゾンビ",
    "魔獣",
    "物質",
    "？？？"
]
const elementList=[//属性リスト
    "無",
    "火",
    "氷",
    "風",
    "土",
    "雷",
    "水",
    "光",
    "闇"
]
const elementColorList=[//属性カラーリスト
    "#F5F5F5",
    "#F5CC88",
    "#97FAFB",
    "#ADFB8E",
    "#F5D09A",
    "#FEFA87",
    "#65A6F9",
    "#ECE9D8",
    "#B488DD"
]
const statusEffectList=[//状態異常リスト
    "炎","氷","幻惑","毒","眠り","混乱","スタン","呪い","攻撃力低下","物理防御力低下","息防御力低下","魔法防御力低下","素早さ低下"
]
const statusEffectWithoutLevelList=[//レベルのない状態異常のリスト
    statusEffectList[4],statusEffectList[5],statusEffectList[7]
]

/* ページごとに表示するコンテンツを変更するための関数 */
function dataBase_get(url){//データベースのデータを取得する関数
    console.log("get", firebaseIdToken)
    fetch(url, {
        method: "GET",
        headers: {
            // Authorization: `Bearer ${firebaseIdToken}`
        }
    }).then(response=>response.json()).then(respondedData=>{
        if(!respondedData){//データが存在しない場合、新規データを追加する
            const dataFramework={enemy:[{founder:true}]}//新規データ
            dataBase_update(dataBaseUrl,dataFramework,firebaseIdToken,"reload")
            return
        }
        let dataWithoutWasteData=respondedData
        if(Page===null){//一覧ページの場合
            dataWithoutWasteData=getDataWithoutNotSavedData(respondedData)//未保存の新規データを削除して取得する
        }
        updateHTML(dataWithoutWasteData)//HTMLを更新する
    })
}
function updateHTML(data){//HTMLを更新する関数
    try{
        if((Boolean(data))===true){
            updateTitle(data)//タイトルを変更する
            updateHeader(data)//ヘッダーを更新する
            createUserMenu()//ユーザーメニューを作成する
            createSideMenu(data)//サイドメニューを作成する
            updateMain(data)//メインを更新する
        }else{//データが入っていないときの処理
            updateHeader(data,"void")//ヘッダーを更新する
            createUserMenu()//ユーザーメニューを作成する
            createSideMenu()//サイドメニューを作成する
        }
    }catch(exception){//存在しない敵データを閲覧・編集しようとしたとき等の例外処理
        location.href=htmlUrl//一覧ページに送る
    }
}
function updateTitle(data){//タイトルを変更する関数
    if(Page==="index"){
        return//一覧ページならタイトルを変更しない
    }else if((Page==="view")||(Page==="edit")){//閲覧・編集ページならタイトルを変更する
        const titleArea=document.getElementById("title")
        const enemyName=data.enemy[Index].name
        const enemyLevel=data.enemy[Index].level
        titleArea.innerHTML=`${enemyName}Lv${convertProperty(enemyLevel)} - ドラルフ神話`//タイトルを変更する
    }
}
function updateHeader(data,_page=Page){//ヘッダーを変更する関数
    const indexUrl=htmlUrl
    const viewUrl=`${htmlUrl}?page=view&index=${Index}`
    const editUrl=`${htmlUrl}?page=edit&index=${Index}`
    let result
    switch (_page){
        case null://一覧ページのヘッダー
            result=`
            <div id="headerContent">
                <input type="text" id="searchTag" placeholder="タグ検索">
                <input type="text" id="searchName" placeholder="名前検索">
                <div id="headerButtonArea">
                    <button class="button" id="createButton">新規作成</button>
                </div>
            </div>
            `
            $(document).on("mousedown","#createButton",function(event){//新規作成ボタンに処理を適用する
                createButton_clickedProcess(event)
            })
            $(document).on("input","#searchTag,#searchName",function(){//検索ボックスに処理を適用する
                const tagFilter=$("#searchTag").val()//タグ検索ボックスに入力された値
                const nameFilter=$("#searchName").val()//名前検索ボックスに入力された値
                updateMainContent(showEnemyData(data,tagFilter,nameFilter))//敵データにフィルターをかけて表示する
            })
            break
        case "view"://閲覧ページのヘッダー
            result=`
            <div id="headerContent">
                <div id="explanation">ドラルフ神話戦闘データエディタ</div>
                <div id="headerButtonArea">
                    <button class="button" id="indexButton">一覧</button>
                    <button class="button" id="editButton"}>編集</button>
                    <button class="button" id="exportButton">出力</button>
                </div>
            </div id="headerContent">
            `
            setUrl("#indexButton",indexUrl)
            setUrl("#editButton",editUrl)
            $(document).on("mousedown","#explanation",function(event){//ホームボタンにクリック処理を適用する
                window.open("https://github.com/LyriDev/DralphMyth-EnemyData/blob/release/README.md")
            })
            $(document).on("click","#exportButton",function(){
                exportEnemyPiece(data.enemy[Index])//出力ボタン処理を適用する
            })
            break
        case "edit"://編集ページのヘッダー
            result=`
            <div id="headerContent">
                <div id="explanation">ドラルフ神話戦闘データエディタ</div>
                <div id="headerButtonArea">
                    <button class="button" id="indexButton">一覧</button>
                    <button class="button" id="viewButton">閲覧</button>
                    <button id="saveButton">保存</button>
                </div>
            </div>
            `
            $(document).on("mousedown","#explanation",function(event){//ホームボタンにクリック処理を適用する
                window.open("https://github.com/LyriDev/DralphMyth-EnemyData/blob/release/README.md")
            })
            $(document).on("mousedown","#indexButton",function(event){//一覧ボタンにクリック処理を適用する
                const inputData=getInputData(data)
                viewButton_clickedProcess(inputData,event,indexUrl)
            })
            $(document).on("mousedown","#viewButton",function(event){//閲覧ボタンにクリック処理を適用する
                const inputData=getInputData(data)
                viewButton_clickedProcess(inputData,event,viewUrl)
            })
            $(document).on("click","#saveButton",function(){//保存ボタンに処理を適用する
                saveEditData(data)
            })
            saveByShortCutKey(data)//ショートカットキーで保存する処理を適用する
            break
        case "void"://データが何もない時のヘッダー
            result=`
                <div id="headerContent">
                    <input type="text" id="searchTag" placeholder="タグ検索">
                    <input type="text" id="searchName" placeholder="名前検索">
                    <div id="headerButtonArea">
                        <button class="button" id="createButton">新規作成</button>
                    </div>
                </div>
            `
            $(document).on("mousedown","#createButton",function(event){//新規作成ボタンに処理を適用する
                createButton_clickedProcess(event)
            })
            break
        default:
            break
    }
    document.getElementById("header").innerHTML=result
}
function createUserMenu(){//ユーザーメニューを作成する関数
    const userMenu=document.getElementById("userMenu")
    const userMenuContent=`
        <div id="userMenuContent">
            <button id="logoutButton" onclick="logout()">ログアウト</button>
        </div>
    `
    userMenu.innerHTML=userMenuContent
}
function createSideMenu(data){//サイドメニューを作成する関数
    if(Page===null){//一覧ページのときのみ実行
        const sideMenu=document.getElementById("sideMenu")
        const downloadLink={
            json:"",
            text:""
        }
        if(Boolean(data)===true){
            downloadLink["json"]='download="data.json"'
            downloadLink["text"]='download="data.txt"'
        }
        const sideMenuContent=`
            <div id="sideMenuContent">
                <a class="button" id="downloadText" href="#" ${downloadLink["text"]}>ダウンロード<br><div class="caption">(text形式)</div></a>
                <a class="button" id="downloadJson" href="#" ${downloadLink["json"]}>ダウンロード<br><div class="caption">(json形式)</div></a>
                <label class="button" id="import">
                    <input id="importJson" type="file" accept="application/json">
                    インポート<br><div class="caption">(json形式)</div>
                </label>
            </div>
        `
        sideMenu.innerHTML=sideMenuContent
        $(document).on("click","#downloadJson",function(){
            if(Boolean(data)===true){
                downloadJson(data,"#downloadJson",false)
            }else{
                alert("データがありません。")
            }
        })
        $(document).on("click","#downloadText",function(){
            if(Boolean(data)===true){
                downloadJson(data,"#downloadText",true)
            }else{
                alert("データがありません。")
            }
        })
        const setImportProcess=function(){//ファイルを受け取ったときの処理
            const importElement=document.getElementById("importJson")
            importJson(importElement)
        }
        $(document).on("change","#importJson",setImportProcess)
        fileDrop()//jsonファイルのドラッグ&ドロップ処理を実装する
    }
}
function updateMain(data,_page=Page){//メインを変更する関数
    let result=""
    switch(_page){//Mainの中身を更新する処理
        case null://一覧ページの際の処理
            result=showEnemyData(data)//全部のデータを表示する
            break
        case "view"://閲覧ページの際の処理
            result=viewEnemyData(data.enemy[Index])//閲覧ページの中身でmainAreaを上書きする
            break
        case "edit"://編集ページの際の処理
            result=getEditPage(data.enemy[Index])//編集ページの中身でmainAreaを上書きする
            break
        default:
            break
    }
    updateMainContent(result)//Mainの中身を更新する
    switch(_page){//Mainの中身に処理を適用する処理
        case null://一覧ページの際の処理
            break
        case "view"://閲覧ページの際の処理
            //textareaの初期値に合わせて高さを自動調整する
            updateAllTextarea("ability-effect")
            updateAllTextarea("move-effect")
            updateTextarea("#note0")
            setAccordionMenu(".cardHeader")//アコーディオンメニューを適用する
            break
        case "edit"://編集ページの際の処理
            createMoveBox(data.enemy[Index].moves,Index)//技欄を作成する
            //textareaの初期値に合わせて高さを自動調整する
            updateAllTextarea("ability-effect")
            updateAllTextarea("move-effect")
            updateTextarea("#note0")
            setAutoAdjustTextarea("textarea")//textareaの入力時に縦幅を自動調整する
            setAccordionMenu(".cardHeader")//アコーディオンメニューを適用する
            break
        default:
            break
    }
}
function updateMainContent(content){//メインの中身を上書きする関数
    mainArea.innerHTML=content//メインの中身を変更する
}
function createButton_clickedProcess(event){//新規作成ボタンが押されたときの処理
    //くそ設計なのでisNotSavedプロパティを取り除いていないデータの取得方法がデータの再取得しか思いつかなかった
    fetch(dataBaseUrl, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${firebaseIdToken}`
        }
    }).then(response=>response.json()).then(data=>{
        let newCreateData=JSON.parse(JSON.stringify(emptyData))
        newCreateData.isNotSaved=true//未保存のデータとして定義(未保存のデータは保存されない)
        let result
        if(Boolean(data)===true){//データが入っているときの処理
            result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
            result.enemy.push(newCreateData)//データに新規データを追加する
        }else{
            result={enemy:[]}//空データを作詞絵
            result.enemy.push(newCreateData)//データに新規データを追加する
        }
        const newPageUrl=`${htmlUrl}?page=edit&index=${result.enemy.length-1}`
        switch(event.button){
            case 0://左クリックのときの処理
                dataBase_update(dataBaseUrl,result,firebaseIdToken,"jump",newPageUrl)
                break
            case 1://中クリックのときの処理
                dataBase_update(dataBaseUrl,result,firebaseIdToken,"open",newPageUrl)
                break
            case 2://右クリックのときの処理
                break
            default:
                break
        }
    })
}
function viewButton_clickedProcess(data,event,url){//編集ページの一覧/閲覧ボタンが押されたときの処理
    let result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    switch(event.button){
        case 0://左クリックのときの処理
            dataBase_update(dataBaseUrl,result,firebaseIdToken,"jump",url)
            break
        case 1://中クリックのときの処理
            dataBase_update(dataBaseUrl,result,firebaseIdToken,"open",url)
            break
        case 2://右クリックのときの処理
            break
        default:
            break
    }
}

/* 一覧ページを表示中に使う関数 */
function showEnemyData(data,tagFilter="",nameFilter=""){//表示する敵データを作成する関数
    const sortedEnemyArray=getSortedEnemyObject(data,tagFilter,nameFilter,true).enemy
    let result=""
    for(let i in sortedEnemyArray){
        result+=createEnemyElement(sortedEnemyArray[i],data)
    }
    return result
}
function getSortedEnemyObject(data,tagFilter="",nameFilter="",keyAddOption=false){//ソートされた敵データを作成する関数
    /* 「タグ>名前>レベル」の順番にソートされる仕様 */
    const gottenData=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    const enemyArray=new Array
    if(tagFilter===""){//タグフィルターなしのとき
        let allEnemyTag=getAllEnemyTag(gottenData)
        for(let i in allEnemyTag){//タグ毎にデータをまとめて出力する
            enemyArray.push(getEnemyDataByTag(gottenData,allEnemyTag[i],nameFilter,keyAddOption))
        }
    }else{//タグフィルターありのとき
        const tmp={enemy:getEnemyDataByTag(gottenData,tagFilter,nameFilter,keyAddOption,true)}//タグ名を前方一致で取得する
        let allEnemyTag=getAllEnemyTag(tmp)
        for(let i in allEnemyTag){//タグ毎にデータをまとめて出力する
            enemyArray.push(getEnemyDataByTag(tmp,allEnemyTag[i],nameFilter,keyAddOption))//指定されたタグを持つデータのみを出力する
        }
    }
    gottenData["enemy"]=enemyArray.flat()
    return gottenData
}
function getAllEnemyTag(data){//敵データの全タグ種を取得する関数
    let enemyTagArray=new Array
    $.each(data.enemy,function(key,value){
        enemyTagArray.push(value.tag)
    })
    let enemyTagList=getTypeArray(enemyTagArray)
    return enemyTagList
}
function getEnemyDataByTag(data,tagName,nameFilter,keyAddOption,leftHandMatchTag=false){//指定されたタグに合致する敵データを取得する関数
    let result=new Array
    let enemyArray=new Array
    $.each(data.enemy,function(key,value){
        if(leftHandMatchTag){
            const tagFilterReg=new RegExp("^"+escapeRegExp(tagName)+".*")//タグでフィルターする前方部分一致の正規表現
            if(tagFilterReg.test(value.tag)){
                if(nameFilter===""){//名前フィルターなしのとき
                    enemyArray.push({key:value.index,value:value})
                }else{//名前フィルターありのとき
                    const nameFilterReg=new RegExp(escapeRegExp(nameFilter)+".*")//前方部分一致の正規表現
                    if(nameFilterReg.test(value.name)){
                        enemyArray.push({key:value.index,value:value})
                    }
                }
            }
        }else{
            if(tagName===value.tag){
                if(nameFilter===""){//名前フィルターなしのとき
                    enemyArray.push({key:value.index,value:value})
                }else{//名前フィルターありのとき
                    const nameFilterReg=new RegExp(escapeRegExp(nameFilter)+".*")//前方部分一致の正規表現
                    if(nameFilterReg.test(value.name)){
                        enemyArray.push({key:value.index,value:value})
                    }
                }
            }
        }
    })
    result.push(getEnemyDataByName(enemyArray,keyAddOption))
    return result.flat()
}
function getEnemyDataByName(enemyArray,keyAddOption){//敵データを名前別に整理する関数
    let result=new Array
    const enemyNameList=getEnemyNameList(enemyArray)
    for(let i in enemyNameList){
        const enemyArraySortedByName=new Array
        for(let j in enemyArray){
            if(enemyArray[j].value.name===enemyNameList[i]){
                const Value=enemyArray[j].value
                const Key=Value.index
                enemyArraySortedByName.push({key:Key,value:Value})
            }
        }
        result.push(getEnemyDataByLevel(enemyArraySortedByName,keyAddOption))
    }
    return result.flat()
}
function getEnemyNameList(enemyArray){//敵データの名前一覧を取得する関数
    let enemyNameList=new Array
    for(let i in enemyArray){
        if(!enemyNameList.includes(enemyArray[i].value.name)){
            enemyNameList.push(enemyArray[i].value.name)
        }
    }
    enemyNameList=enemyNameList.sort()//文字コード順に並べ替える
    return enemyNameList
}
function getEnemyDataByLevel(enemyArray,keyAddOption){//敵データをレベル別に整理する関数
    let result=new Array
    const enemyLevelList=getEnemyLevelList(enemyArray)
    for(let i in enemyLevelList){
        for(let j in enemyArray){
            if(enemyArray[j].value.level===enemyLevelList[i]){
                if(keyAddOption){
                    const keyAddedData=enemyArray[j].value
                    keyAddedData["key"]=enemyArray[j].key//元データのkeyを追加
                    result.push(keyAddedData)
                }else{
                    result.push(enemyArray[j].value)
                }
            }
        }
    }
    return result
}
function getEnemyLevelList(enemyArray){//敵データのレベル一覧を取得する関数
    let enemyLevelArray=new Array
    for(let i in enemyArray){
        enemyLevelArray.push(enemyArray[i].value.level)
    }
    let enemyLevelList=getTypeArray(enemyLevelArray)
    return enemyLevelList
}
function createEnemyElement(enemyData,data){//表示する敵データの要素を作成する関数
    const key=enemyData.key
    const name=enemyData.name
    const level=enemyData.level
    const tag=enemyData.tag
    let result=`
        <div class="data">
            <div class="name">${name}</div>
            <div class="level">Lv${convertProperty(level)}</div>
            <div class="tag">${tag}</div>
            <div class="buttonArea">
                <button class="button" id="editButton${key}">編集</button>
                <button class="button" id="viewButton${key}">閲覧</button>
                <button class="button" id="exportButton${key}">出力</button>
                <button class="button" id="deleteButton${key}">削除</button>
            </div>
        </div>
    `
    const editUrl=`${htmlUrl}?page=edit&index=${key}`
    const viewUrl=`${htmlUrl}?page=view&index=${key}`
    setUrl(`#editButton${key}`,editUrl)
    setUrl(`#viewButton${key}`,viewUrl)
    $(document).off("click",`#exportButton${key}`)
    $(document).on("click",`#exportButton${key}`,function(){
        exportEnemyPiece(enemyData)//出力ボタン処理を適用する
    })
    $(document).off("click",`#deleteButton${key}`)
    $(document).on("click",`#deleteButton${key}`,function(){
        deleteEnemyPiece(key,data)//削除ボタン処理を適用する
    })
    return result
}
function getSortedMoves(moves){//ソートされた技配列を取得する関数
    const moveIndexList=new Array//全ての技番号
    for(let i in moves){
        const move=moves[i]
        moveIndexList.push(move.index)
    }
    const moveIndexTypeList=getTypeArray(moveIndexList)//技番号の種類一覧
    const result=new Array
    for(let i in moveIndexTypeList){//技番号順に並び変える
        for(let j in moves){
            const move=moves[j]
            if(move.index===moveIndexTypeList[i]){
                result.push(move)
            }
        }
    }
    return result
}
function getMovesAsText(enemyData){//技一覧をテキストで取得する関数
    let returnArray=new Array
    const indent="  "
    const sortedMoves=getSortedMoves(enemyData.moves)
    for(let i in sortedMoves){//技番号順に並び変えて表示する
        let moveData=""
        const move=sortedMoves[i]
        const content=[
            `${convertProperty(move.index)}.${convertProperty(move.name)}`,//技番号,技名,属性,攻撃種別
            [],//成功率,攻撃回数,ダメージ
            [],//射程,範囲
            [],//状態異常
            []//効果
        ]
        /* 属性,攻撃種別の表示 */
        if((Number(move.damage)!==0)||(move.damage==="")){//属性と攻撃種別の表示
            content[0]+=`(${convertProperty(addDotToArray(deleteValueInArray(move.elements,""),"・"))}属性,${convertProperty(addDotToArray(deleteValueInArray(move.types,""),"・"))})`
        }
        /* 射程,範囲の表示 */
        if((Number(move.reach)!==0)||(move.reach==="")){//射程の表示
            content[1].push(`射程${viewReach(convertProperty(move.reach),move.canDiagonal)}`)
        }
        if(move.range!==""){//範囲の表示
            content[1].push(move.range)
        }
        content[1]=addDotToArray(content[1],",")
        /* 成功率,攻撃回数,ダメージの表示 */
        if((Number(move.successRate)<100)||(move.successRate==="")){//成功率の表示
            content[2].push(`成功率${convertProperty(move.successRate)}%`)
        }
        if((String(move.attackNumber)!=="1")&&(String(move.attackNumber)!=="0")){//攻撃回数の表示
            content[2].push(`攻撃回数${convertProperty(move.attackNumber)}回`)
        }
        if((Number(move.damage)!==0)||(move.damage==="")){//ダメージの表示
            content[2].push(`ダメージ${convertProperty(move.damage)}`)
        }
        content[2]=addDotToArray(content[2],",")
        /* 状態異常の表示 */
        for(let k in move.statusEffects){
            content[3].push(`${convertProperty(move.statusEffects[k].effectType)}${hideTheZeroProperty(move.statusEffects[k].level,`Lv${convertProperty(move.statusEffects[k].level)}`)}${hideTheZeroProperty(move.statusEffects[k].turn),`(${convertProperty(move.statusEffects[k].turn)}ターン)`}`)
        }
        content[3]=addDotToArray(content[3],"\n"+indent)
        /* 効果の表示 */
        for(let k in move.effects){
            content[4].push(`${convertString(convertProperty(move.effects[k]),"\n","\n"+indent)}`)
        }
        content[4]=addDotToArray(content[4],"\n"+indent)
        /* 表示加工処理 */
        for(let k in content){
            if(content[k]===""){continue}//行に何もないなら処理をしない
            if(Number(k)!==0){moveData+="\n"+indent}
            moveData+=content[k]
        }
        returnArray.push(moveData)
    }
    return returnArray
}

/* 閲覧・編集ページを表示中に使う関数 */
function addAbilityBox(abilitiesArray,page=Page){//特性を取得して、追加する関数
    const boxName="ability"
    let result=""
    if(Boolean(abilitiesArray)===true){
        for(let i in abilitiesArray){
            result+=createAbilityBox(abilitiesArray[i],i,page).content
            if(page==="edit"){setDeleteButtonProcess("ability",i)}//削除ボタンに処理を適用する
        }
    }else{//データがないときの処理
/*         result+=createAbilityBox().content
        if(page==="edit"){setDeleteButtonProcess("ability",0)}//削除ボタンに処理を適用する */
    }
    if(page==="edit"){setAddButtonProcess(boxName)}//特性に追加ボタンの処理を適用する
    return result
}
function createAbilityBox(ability=newData.abilities[0],index=null,page=Page){//追加する特性を作成する関数
    let abilityIndex=0
    if(Boolean(index)===true){
        abilityIndex=index
    }else{//index引数が指定されていないなら、要素の最後の数をindexとして設定する
        abilityIndex=getFinalNumber(addedElementsIndex.ability)
    }
    addedElementsIndex.ability.push(Number(abilityIndex))
    let content=""
    let isReadOnly=""
    let deleteButton=""
    if(page==="view"){
        isReadOnly="readonly"
    }else if(page==="edit"){
        deleteButton=`<button id="deleteButton-ability-${abilityIndex}" class="button deleteButton-ability">削除</button>`
    }
    content=`
        <div id="ability-${abilityIndex}" class="cardTable">
            ${deleteButton}
            <div class="cardTable-ability-name">
                <div class="cardTableTitle">特性名</div>
                <input ${isReadOnly} type="text" class="cardTableContent" value="${ability.name}">
            </div>
            <div class="cardTable-ability-effect">
                <div class="cardTableTitle">
                    <div>効果</div>
                </div>
                <textarea ${isReadOnly} id="ability-effect${abilityIndex}" class="cardTableContent" rows="1">${ability.effect}</textarea>
            </div>
        </div>
    `
    const result={
        content:content,
        index:abilityIndex
    }
    return result
}
function createMoveBox(moves=newData.moves[0],index=null,page=Page){//追加する技を作成する関数
    const moveBoxMaster=document.getElementById("move")//技欄の親要素を入れるための親要素
        //状態異常のリストを作成する
        const statusEffectListId="statusEffectList"
        const statusEffectListElement=document.createElement("div")
        statusEffectListElement.innerHTML=createDataList(statusEffectListId,statusEffectList)
        moveBoxMaster.appendChild(statusEffectListElement.firstElementChild)
    function createMoveElements(move,moveEffectRows=1){//技欄を1つ作成する関数
        function createMoveCheckBox(list,boxName){//チェックボックスを作成する関数
            //チェックボックスの親要素を作成
            const checkBoxElement=document.createElement("div")
            checkBoxElement.classList.add("cardTableContent")
            let result=""
            let isChecked=""
            let property=undefined
            if(boxName==="move-element"){
                property=move.elements
            }else if(boxName==="move-type"){
                property=move.types
            }else if(boxName==="move-canDiagonal"){
                if(move.canDiagonal===undefined)move.canDiagonal=false
                property=[move.canDiagonal]
            }
            for(let i in list){
                if(Boolean(property)===true){
                    if((property.includes(list[i]))||(move.canDiagonal)){
                        isChecked="checked"
                    }else{
                        isChecked=""
                    }
                }
                let color=""
                if(boxName==="move-element")color=`style="color:${elementColorList[i]};"`//属性ラベルに属性色を付ける
                const checkBoxKey=uniqueKey.next().value
                result+=`
                    <div class="${boxName}">
                        <label for="move-checkBox-${checkBoxKey}" ${color}>${list[i]}</label>
                        <br>
                        <input type="checkbox" id="move-checkBox-${checkBoxKey}" class="${boxName}-${i}" ${isChecked}>
                    </div>
                `
            }
            checkBoxElement.innerHTML=result
            return checkBoxElement
        }
        function createMoveStatusEffectBox(statusEffects){//状態異常欄を作成する関数
            const freeSpace=new Array
            //状態異常欄の親要素を作成する
            freeSpace[0]=document.createElement("div")
            freeSpace[0].classList.add("cardTable-move-statusEffect","clearFix")
            //タイトル欄を作成する
            freeSpace[1]=document.createElement("div")
            freeSpace[1].classList.add("cardTable-move-statusEffect-title","clearFix")
            //種別のタイトル欄を作成する
            freeSpace[2]=document.createElement("div")//種別欄を入れるための親要素
            freeSpace[2].classList.add("cardTable-move-statusEffect-type")
            freeSpace[3]=document.createElement("div")//種別欄のタイトル
            freeSpace[3].classList.add("cardTableTitle")
            freeSpace[3].textContent="状態異常"
            freeSpace[2].appendChild(freeSpace[3])
            //レベルのタイトル欄を作成する
            freeSpace[4]=document.createElement("div")//レベル欄を入れるための親要素
            freeSpace[4].classList.add("cardTable-move-statusEffect-level")
            freeSpace[5]=document.createElement("div")//レベル欄のタイトル
            freeSpace[5].classList.add("cardTableTitle")
            freeSpace[5].textContent="レベル"
            freeSpace[4].appendChild(freeSpace[5])
            //ターンのタイトル欄を作成する
            freeSpace[6]=document.createElement("div")//ターン欄を入れるための親要素
            freeSpace[6].classList.add("cardTable-move-statusEffect-turn")
            freeSpace[7]=document.createElement("div")//ターン欄のタイトル
            freeSpace[7].classList.add("cardTableTitle")
            freeSpace[7].textContent="ターン"
            freeSpace[6].appendChild(freeSpace[7])
            //値欄を作成する
            freeSpace[8]=document.createElement("div")
            freeSpace[8].classList.add("cardTable-move-statusEffect-value","clearFix")
            function addMoveStatusEffectBox(statusEffect){//状態異常欄の値を1つ追加する関数
                const newStatusElement=new Array
                //値の親要素を作成する
                newStatusElement[0]=document.createElement("div")
                newStatusElement[0].classList.add("clearFix")
                //種別欄の値を作成する
                newStatusElement[1]=document.createElement("input")
                newStatusElement[1].type="text"
                newStatusElement[1].setAttribute("list",statusEffectListId)//datalistを登録する
                newStatusElement[1].classList.add("cardTableContent","cardTable-move-statusEffect-type")
                newStatusElement[1].value=statusEffect.effectType
                newStatusElement[0].appendChild(newStatusElement[1])//種別欄の値を追加する
                //レベル欄の値を作成する
                newStatusElement[2]=document.createElement("input")
                newStatusElement[2].type="number"
                newStatusElement[2].classList.add("cardTableContent","cardTable-move-statusEffect-level")
                newStatusElement[2].value=statusEffect.level
                newStatusElement[0].appendChild(newStatusElement[2])//レベル欄の値を追加する
                //ターン欄の値を作成する
                newStatusElement[3]=document.createElement("input")
                newStatusElement[3].type="number"
                newStatusElement[3].classList.add("cardTableContent","cardTable-move-statusEffect-turn")
                newStatusElement[3].value=statusEffect.turn
                newStatusElement[0].appendChild(newStatusElement[3])//ターン欄の値を追加する
                //削除ボタンを作成する
                newStatusElement[4]=document.createElement("button")
                newStatusElement[4].classList.add("deleteButton")
                newStatusElement[4].textContent="削除"
                newStatusElement[4].addEventListener("click",function(){
                    //削除ボタンの親要素を削除する
                    newStatusElement[0].remove()
                },false)
                newStatusElement[0].appendChild(newStatusElement[4])//削除ボタンを追加する
                return newStatusElement[0]
            }
            for(let i=0;i<statusEffects.length;i++){//状態異常欄の値を追加していく
                freeSpace[8].appendChild(addMoveStatusEffectBox(statusEffects[i]))
            }
            //追加ボタンを作成する
            freeSpace[9]=document.createElement("button")
            freeSpace[9].classList.add("addButton")
            freeSpace[9].textContent="追加"
            freeSpace[9].addEventListener("click",function(){
                const newStatusEffect={
                    effectType:"",
                    level:"",
                    turn:""
                }
                freeSpace[8].appendChild(addMoveStatusEffectBox(newStatusEffect))//新しい状態異常欄を追加する
            },false)
            //作成したものを親要素にぶち込んでいく
            freeSpace[1].appendChild(freeSpace[2])//種別のタイトル欄
            freeSpace[1].appendChild(freeSpace[4])//レベルのタイトル欄
            freeSpace[1].appendChild(freeSpace[6])//ターンのタイトル欄
            freeSpace[0].appendChild(freeSpace[1])//タイトル欄
            freeSpace[0].appendChild(freeSpace[9])//追加ボタン
            freeSpace[0].appendChild(freeSpace[8])//値欄
            return freeSpace[0]
        }
        function createMoveEffectBox(effects,effectRows=moveEffectRows){//効果欄を作成する関数
            const freeSpace=new Array
            //効果欄の親要素を作成する
            freeSpace[0]=document.createElement("div")
            freeSpace[0].classList.add("cardTable-move-effect","clearFix")
            //タイトル欄を作成する
            freeSpace[1]=document.createElement("div")
            freeSpace[1].classList.add("cardTableTitle")
            freeSpace[1].textContent="効果"
            freeSpace[0].appendChild(freeSpace[1])
            function addMoveEffectBox(effect){//効果欄の値を1つ追加する関数
                const newEffectElement=new Array
                //値欄の親要素を作成する
                newEffectElement[0]=document.createElement("div")
                newEffectElement[0].classList.add("clearFix","move-effect-value")
                //値欄を作成する
                newEffectElement[1]=document.createElement("textarea")
                newEffectElement[1].classList.add("cardTableContent")
                newEffectElement[1].setAttribute("id",`move-effect${uniqueKey.next().value}`)
                newEffectElement[1].setAttribute("rows",`${effectRows}`)
                newEffectElement[1].textContent=effect
                newEffectElement[0].appendChild(newEffectElement[1])
                //削除ボタンを作成する
                newEffectElement[2]=document.createElement("button")
                newEffectElement[2].classList.add("deleteButton")
                newEffectElement[2].textContent="削除"
                newEffectElement[2].addEventListener("click",function(){
                    //削除ボタンの親要素を削除する
                    newEffectElement[0].remove()
                },false)
                newEffectElement[0].appendChild(newEffectElement[2])//削除ボタンを追加する
                return newEffectElement[0]
            }
            //効果欄を作成する
            for(let i=0;i<effects.length;i++){
                freeSpace[0].appendChild(addMoveEffectBox(effects[i]))
            }
            //追加ボタンを作成する
            freeSpace[2]=document.createElement("button")
            freeSpace[2].classList.add("addButton")
            freeSpace[2].textContent="追加"
            freeSpace[2].addEventListener("click",function(){
                freeSpace[0].appendChild(addMoveEffectBox(""))//新しい効果欄を追加する
            },false)
            freeSpace[0].appendChild(freeSpace[2])
            return freeSpace[0]
        }
        //技欄を1つ作成する
        const newMoveBox=document.createElement("div")
        newMoveBox.classList.add("cardTable","clearFix")
        const elementBoxes=new Array
        //技番号欄と技名欄の作成
        elementBoxes[0]=document.createElement("div")
        elementBoxes[0].classList.add("clearFix")
        elementBoxes[0].innerHTML=`
            <div class="cardTable-move-index">
                <div class="cardTableTitle">技番号</div>
                <input type="number" class="cardTableContent" value="${move.index}">
            </div>
            <div class="cardTable-move-name">
                <div class="cardTableTitle">技名</div>
                <input type="text" class="cardTableContent" value="${move.name}">
            </div>
        `
        //属性欄と種別欄の作成
        elementBoxes[1]=document.createElement("div")
        elementBoxes[1].classList.add("clearFix")
        const freeSpace=new Array
        freeSpace[0]=document.createElement("div")//属性欄を作成する
        freeSpace[0].classList.add("cardTable-move-element")
        freeSpace[1]=document.createElement("div")
        freeSpace[1].classList.add("cardTableTitle")
        freeSpace[1].textContent="属性"
        freeSpace[0].appendChild(freeSpace[1])
        freeSpace[0].appendChild(createMoveCheckBox(elementList,"move-element"))
        elementBoxes[1].appendChild(freeSpace[0])//属性欄を追加する
        freeSpace[2]=document.createElement("div")//種別欄を作成する
        freeSpace[2].classList.add("cardTable-move-type")
        freeSpace[3]=document.createElement("div")
        freeSpace[3].classList.add("cardTableTitle")
        freeSpace[3].textContent="種別"
        freeSpace[2].appendChild(freeSpace[3])
        freeSpace[2].appendChild(createMoveCheckBox(attackTypeList,"move-type"))
        elementBoxes[1].appendChild(freeSpace[2])//種別欄を追加する
        //射程欄と範囲欄の作成
        elementBoxes[2]=document.createElement("div")
        elementBoxes[2].classList.add("clearFix")
        elementBoxes[2].innerHTML=`
            <div class="cardTable-move-reach">
                <div class="cardTableTitle">射程</div>
                <input type="number" class="cardTableContent" value="${move.reach}">
            </div>`
        const canDiagonalBox=document.createElement("div")
        canDiagonalBox.classList.add("cardTable-move-canDiagonal")
        canDiagonalBox.appendChild(createMoveCheckBox(["斜め可"],"move-canDiagonal"))
        elementBoxes[2].appendChild(canDiagonalBox)
        elementBoxes[2].innerHTML+=`
            <div class="cardTable-move-range">
                <div class="cardTableTitle">範囲</div>
                <input type="text" class="cardTableContent" value="${move.range}">
            </div>
        `
        //成功率欄と攻撃回数欄とダメージ欄の作成
        elementBoxes[3]=document.createElement("div")
        elementBoxes[3].classList.add("clearFix")
        elementBoxes[3].innerHTML=`
            <div class="cardTable-move-successRate">
                <div class="cardTableTitle">成功率</div>
                <input type="number" class="cardTableContent" value="${move.successRate}">
                <div class="move-add">%</div>
            </div>
            <div class="cardTable-move-attackNumber">
                <div class="cardTableTitle">攻撃回数</div>
                <input type="text" class="cardTableContent" value="${move.attackNumber}">
            </div>
            <div class="cardTable-move-damage">
                <div class="cardTableTitle">ダメージ</div>
                <input type="text" class="cardTableContent" value="${move.damage}">
            </div>
        `
        //状態異常欄の作成
        let statusEffects
        if(move.statusEffects){
            statusEffects=move.statusEffects
        }else{
            statusEffects=new Array
        }
        elementBoxes[4]=createMoveStatusEffectBox(statusEffects)
        //効果欄の作成
        let effects
        if(move.effects){
            effects=move.effects
        }else{
            effects=new Array
        }
        elementBoxes[5]=createMoveEffectBox(effects)
        //削除ボタンを作成する
        const deleteButtonMove=document.createElement("button")
        deleteButtonMove.classList.add("deleteButton")
        deleteButtonMove.textContent="削除"
        deleteButtonMove.addEventListener("click",function(){
            //削除ボタンの親要素を削除する
            deleteButtonMove.parentNode.parentNode.remove()
        },false)
        elementBoxes[0].appendChild(deleteButtonMove)//作成した削除ボタンを技欄に追加する
        //作成した複数の欄を技欄に追加する
        for(let i in elementBoxes){
            newMoveBox.appendChild(elementBoxes[i])
        }
        return newMoveBox
    }
    //技欄の親要素を作成
    const moveBoxContent=document.createElement("div")
    moveBoxContent.classList.add("move-content")
    //1つずつ技欄を作成する
    if((moves)&&(moves.length>0)){
        const sortedMoves=getSortedMoves(moves)
        for(let i=0;i<sortedMoves.length;i++){
            moveBoxContent.appendChild(createMoveElements(sortedMoves[i]))
        }
    }
    //技欄追加ボタンを作成
    const addButtonMove=document.createElement("button")
    addButtonMove.classList.add("addButton")
    addButtonMove.textContent="追加"
    addButtonMove.addEventListener("click",function(){
        //新しい技欄を追加する
        moveBoxContent.appendChild(createMoveElements(newData.moves[0]))
    },false)
    //いてつく波動追加ボタンを作成する
    const disruptiveWave={
        index:"",name:"いてつく波動",
        reach:0,canDiagonal:false,range:"全範囲",
        successRate:100,attackNumber:"1",damage:"0",
        effects:["敵全員に必中、かかっている良効果を全解除\n(次の自分のターンが終わるまで再使用しない)"]
    }
    const addDisWavButtonMove=document.createElement("button")
    addDisWavButtonMove.classList.add("addButton")
    addDisWavButtonMove.textContent="いてつく波動追加"
    addDisWavButtonMove.addEventListener("click",function(){
        //新しい技欄を追加する
        moveBoxContent.appendChild(createMoveElements(disruptiveWave,2))
    },false)
    //完成した技欄を入れるための親要素と追加ボタンを技欄の親要素を入れるための親要素に追加
    moveBoxMaster.appendChild(moveBoxContent)
    moveBoxMaster.appendChild(addButtonMove)
    moveBoxMaster.appendChild(addDisWavButtonMove)
}

/* 閲覧ページを表示中に使う関数 */
function viewEnemyData(enemyDataValue){//閲覧ページを作成する関数
    let result= `
        <div id="name">${enemyDataValue.name}&nbsp;Lv${convertProperty(enemyDataValue.level)}</div>
        <div id="tag">${enemyDataValue.tag}</div>
        <div class="parameterBox">
            <div>属性<br>${convertProperty(addDotToArray(deleteValueInArray(enemyDataValue.elements,""),"・"))}</div>
            <div>系統<br>${convertProperty(addDotToArray(addValueToArray(deleteValueInArray(enemyDataValue.species,""),"系"),"・"))}</div>
            <div>SANチェック<br>${convertProperty(enemyDataValue.sanCheck.success)}/${convertProperty(enemyDataValue.sanCheck.failure)}</div>
        </div>
        <div class="parameterBox">
            <div>HP<br>${convertProperty(enemyDataValue.HP)}</div>
            <div>装甲<br>${convertProperty(enemyDataValue.armor)}</div>
            <div>イニシアチブ<br>${convertProperty(enemyDataValue.initiative)}</div>
            <div>行動P<br>${convertProperty(enemyDataValue.actionPoint)}</div>
            <div>回避<br>${convertProperty(enemyDataValue.dodge)}%</div>
            <div>行動回数<br>${convertProperty(enemyDataValue.actionNumber)}回</div>
        </div>
        <table class="statusEffectTable">
            <tr>
                <th>炎</th>
                <th>氷</th>
                <th>幻惑</th>
                <th>毒</th>
                <th>眠り</th>
                <th>混乱</th>
                <th>スタン</th>
                <th>呪い</th>
                <th>隠密</th>
            </tr>
            <tr>
                <td>${convertProperty(enemyDataValue.statusEffects.flame)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.ice)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.dazzle)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.poison)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.sleep)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.confusion)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.stun)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.curse)}%</td>
                <td>${convertAvailability(enemyDataValue.stealth)}</td>
            </tr>
        </table>
        <table class="statusEffectTable">
            <tr>
                <th>攻撃力低下</th>
                <th>物理防御力<br>低下</th>
                <th>息防御力<br>低下</th>
                <th>魔法防御力<br>低下</th>
                <th>素早さ低下</th>
            </tr>
            <tr>
                <td>${convertProperty(enemyDataValue.statusEffects.atkDown)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.defDown.physical)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.defDown.breath)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.defDown.magic)}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.spdDown)}%</td>
            </tr>
        </table>
        <div class="cardBox">
            <div class="cardHeader" data-target="ability">
                <div class="cardHeaderTitle">特性</div>
                <a class="cardHeaderIcon">
                    <span id="abilityArrow" class="arrowDown"></span>
                </a>
            </div>
            <div id="ability" class="cardBody">
                ${addAbilityBox(enemyDataValue.abilities)}
            </div>
        </div>
        <div class="cardBox">
            <div class="cardHeader" data-target="move">
                <div class="cardHeaderTitle">技</div>
                <a class="cardHeaderIcon">
                    <span id="moveArrow" class="arrowDown"></span>
                </a>
            </div>
            <div id="move" class="cardBody">
                ${addMoveBox(enemyDataValue)}
            </div>
        </div>
        <div class="cardBox">
        <div class="cardHeader" data-target="note">
            <div class="cardHeaderTitle">備考</div>
            <a class="cardHeaderIcon">
                <span id="noteArrow" class="arrowDown"></span>
            </a>
        </div>
        <div id="note" class="cardBody">
            <div class="cardTable">
                <textarea readonly id="note0" class="cardTableContent" rows="1">${enemyDataValue.note}</textarea>
            </div>
        </div>
    `
    return result
}
function addMoveBox(enemyData){//閲覧ページの技欄を作成する関数
    let result=""
    const sortedMoves=getSortedMoves(enemyData.moves)
    for(let i in sortedMoves){//技番号順に並び変えて表示する
        result+=`
            <div class="cardTable">
                <div class="clearFix">
                    <div class="cardTable-move-index">
                        <div class="cardTableTitle">技番号</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].index}">
                    </div>
                    <div class="cardTable-move-name">
                        <div class="cardTableTitle">技名</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].name}">
                    </div>
                    <div class="cardTable-move-element">
                        <div class="cardTableTitle">属性</div>
                        <input readonly type="text" class="cardTableContent" value="${addDotToArray(deleteValueInArray(sortedMoves[i].elements,""),"・")}">
                    </div>
                    <div class="cardTable-move-type">
                        <div class="cardTableTitle">種別</div>
                        <input readonly type="text" class="cardTableContent" value="${addDotToArray(deleteValueInArray(sortedMoves[i].types,""),"・")}">
                    </div>
                    <div class="cardTable-move-reach">
                        <div class="cardTableTitle">射程</div>
                        <input readonly type="text" class="cardTableContent" value="${viewReach(sortedMoves[i].reach,sortedMoves[i].canDiagonal)}">
                    </div>
                    <div class="cardTable-move-range">
                        <div class="cardTableTitle">範囲</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].range}">
                    </div>
                    <div class="cardTable-move-successRate">
                        <div class="cardTableTitle">成功率</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].successRate}">
                        <div class="move-add">%</div>
                    </div>
                    <div class="cardTable-move-attackNumber">
                        <div class="cardTableTitle">攻撃回数</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].attackNumber}">
                    </div>
                    <div class="cardTable-move-damage">
                        <div class="cardTableTitle">ダメージ</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].damage}">
                    </div>
                </div>
                ${addMoveBox_statusEffect(sortedMoves[i].statusEffects)}
                ${addMoveBox_effect(sortedMoves[i].effects)}
            </div>
        `
    }
    return result
}
function addMoveBox_statusEffect(moveStatusEffectArray){//閲覧ページの技欄の状態異常欄を作成する関数
    if(Boolean(moveStatusEffectArray)===false){return ""}//状態異常がないなら欄を作らない
    let result=""
    result+=`
        <div class="cardTable-move-statusEffect clearFix">
            <div class="cardTable-move-statusEffect-type">
                <div class="cardTableTitle">状態異常</div>
                ${addMoveBox_statusEffect_content(moveStatusEffectArray,"effectType")}
            </div>
            <div class="cardTable-move-statusEffect-level">
                <div class="cardTableTitle">レベル</div>
                ${addMoveBox_statusEffect_content(moveStatusEffectArray,"level")}
            </div>
                <div class="cardTable-move-statusEffect-turn">
                <div class="cardTableTitle">ターン</div>
                ${addMoveBox_statusEffect_content(moveStatusEffectArray,"turn")}
            </div>
        </div>
    `
    return result
}
function addMoveBox_statusEffect_content(moveStatusEffectArray,key){//閲覧ページの技欄の状態異常欄の中身を作成する関数
    let result=""
    for(let i in moveStatusEffectArray){
        switch(key){
            case "effectType":
                result+=`<input readonly type="text" class="cardTableContent" value="${moveStatusEffectArray[i].effectType}">`
                break
            case "level":
                result+=`<input readonly type="text" class="cardTableContent" value="${moveStatusEffectArray[i].level}">`
                break
            case "turn":
                result+=`<input readonly type="text" class="cardTableContent" value="${moveStatusEffectArray[i].turn}">`
                break
            default:
                break
        }
    }
    return result
}
function addMoveBox_effect(moveEffectArray){//閲覧ページの技欄の効果欄を作成する関数
    if(Boolean(moveEffectArray)===false){return ""}//効果がないなら欄を作らない
    let result=""
    result+=`
        <div class="cardTable-move-effect">
            <div class="cardTableTitle">効果</div>
            ${addMoveBox_effect_content(moveEffectArray)}
        </div>
    `
    return result
}
function addMoveBox_effect_content(moveEffectArray){//閲覧ページの技欄の効果欄の中身を作成する関数
    let result=""
    for(let i in moveEffectArray){
        result+=`
            <textarea readonly id="move-effect${uniqueKey.next().value}" class="cardTableContent" rows="1">${moveEffectArray[i]}</textarea>
        `
    }
    return result
}

/* 編集ページを表示中に使う関数 */
const addedElementsIndex={//編集ページで、追加ボタンで追加する要素のindex
    species:[],
    ability:[],
    moves:{
        move:[],
        statusEffect:[],
        effect:[]
    }
}
function getEditPage(enemyData){
    let result=`
        <div class="cardBox">
            <div class="cardHeader" data-target="symbol">
                <div class="cardHeaderTitle">基本情報</div>
                <a class="cardHeaderIcon">
                    <span id="symbolArrow" class="arrowDown"></span>
                </a>
            </div>
            <div id="symbol" class="cardBody">
                <div class="cardTable">
                    <div class="clearFix">
                        <div class="cardTableContent">
                            <label for="symbol-name">名前</label>
                            <input type="text" id="symbol-name" value="${enemyData.name}">
                        </div>
                        <div class="cardTableContent">
                            <label for="symbol-level">Lv</label>
                            <input type="number" id="symbol-level" value="${enemyData.level}">
                        </div>
                    </div>
                    <div class="cardTableContent clearFix">
                        <label for="symbol-tag">タグ</label>
                        <input type="text" id="symbol-tag" value="${enemyData.tag}">
                    </div>
                    <div class="cardTableContent">
                        <label id="symbol-element-label">属性</label>
                        <div id="symbol-element-content">
                            ${createElementCheckBox(enemyData,"symbol-element")}
                        </div>
                    </div>
                    <div id="symbol-species" class="clearFix">
                        <button id="addButton-symbol-species" class="button">追加</button>
                        <label>種族</label>
                        <div id="symbol-species-content">${addSpecieBox(enemyData.species)}</div>
                    </div>
                    <div class="cardTableContent">
                        <table id="symbol-parameter">
                            <tr>
                                <td>SANチェック</td>
                                <td>
                                    <input type="text" id="symbol-parameter-sanCheck-success" value="${enemyData.sanCheck.success}">
                                    <div class=cardTableContent-add>/</div>
                                    <input type="text" id="symbol-parameter-sanCheck-failure" value="${enemyData.sanCheck.failure}">
                                </td>
                            </tr>
                            <tr>
                                <td>HP</td>
                                <td><input type="number" id="symbol-parameter-HP" value="${enemyData.HP}"></td>
                            </tr>
                            <tr>
                                <td>装甲</td>
                                <td><input type="number" id="symbol-parameter-armor" value="${enemyData.armor}"></td>
                            </tr>
                            <tr>
                                <td>イニシアチブ</td>
                                <td><input type="number" id="symbol-parameter-initiative" value="${enemyData.initiative}"></td>
                            </tr>
                            <tr>
                                <td>行動P</td>
                                <td><input type="number" id="symbol-parameter-actionPoint" value="${enemyData.actionPoint}"></td>
                            </tr>
                            <tr>
                                <td>回避</td>
                                <td>
                                <input type="number" id="symbol-parameter-dodge" value="${enemyData.dodge}">
                                <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>行動回数</td>
                                <td>
                                <input type="number" id="symbol-parameter-actionNumber" value="${enemyData.actionNumber}">
                                <div class=cardTableContent-add>回</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="cardBox">
            <div class="cardHeader" data-target="statusEffects">
                <div class="cardHeaderTitle">耐性</div>
                <a class="cardHeaderIcon">
                    <span id="statusEffectsArrow" class="arrowDown"></span>
                </a>
            </div>
            <div id="statusEffects" class="cardBody">
                <div class="cardTable">
                    <div class="cardTableContent">
                        <table>
                            <tr>
                                <td>炎</td>
                                <td>
                                    <input type="number" id="statusEffects-flame" value="${enemyData.statusEffects.flame}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>氷</td>
                                <td>
                                    <input type="number" id="statusEffects-ice" value="${enemyData.statusEffects.ice}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>幻惑</td>
                                <td>
                                    <input type="number" id="statusEffects-dazzle" value="${enemyData.statusEffects.dazzle}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>毒</td>
                                <td>
                                    <input type="number" id="statusEffects-poison" value="${enemyData.statusEffects.poison}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>眠り</td>
                                <td>
                                    <input type="number" id="statusEffects-sleep" value="${enemyData.statusEffects.sleep}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>混乱</td>
                                <td>
                                    <input type="number" id="statusEffects-confusion" value="${enemyData.statusEffects.confusion}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>スタン</td>
                                <td>
                                    <input type="number" id="statusEffects-stun" value="${enemyData.statusEffects.stun}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>呪い</td>
                                <td>
                                    <input type="number" id="statusEffects-curse" value="${enemyData.statusEffects.curse}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>隠密</td>
                                <td>
                                    <select id="statusEffects-stealth">
                                        ${createStealthSelect(enemyData.stealth)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>攻撃力低下</td>
                                <td>
                                    <input type="number" id="statusEffects-atkDown" value="${enemyData.statusEffects.atkDown}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>物理防御力低下</td>
                                <td>
                                    <input type="number" id="statusEffects-defDown-physical" value="${enemyData.statusEffects.defDown.physical}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>息防御力低下</td>
                                <td>
                                    <input type="number" id="statusEffects-defDown-breath" value="${enemyData.statusEffects.defDown.breath}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>魔法防御力低下</td>
                                <td>
                                    <input type="number" id="statusEffects-defDown-magic" value="${enemyData.statusEffects.defDown.magic}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                            <tr>
                                <td>素早さ低下</td>
                                <td>
                                    <input type="number" id="statusEffects-spdDown" value="${enemyData.statusEffects.spdDown}">
                                    <div class=cardTableContent-add>%</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="cardBox">
            <div class="cardHeader" data-target="ability">
                <div class="cardHeaderTitle">特性</div>
                <a class="cardHeaderIcon">
                    <span id="abilityArrow" class="arrowDown"></span>
                </a>
            </div>
            <div id="ability" class="cardBody">
                <div id="ability-content">
                    ${addAbilityBox(enemyData.abilities)}
                </div>
                <button id="addButton-ability" class="button">追加</button>
            </div>
        </div>
        <div class="cardBox">
            <div class="cardHeader" data-target="move">
                <div class="cardHeaderTitle">技</div>
                <a class="cardHeaderIcon">
                    <span id="moveArrow" class="arrowDown"></span>
                </a>
            </div>
            <div id="move" class="cardBody">

            </div>
        </div>
        <div class="cardBox">
        <div class="cardHeader" data-target="note">
            <div class="cardHeaderTitle">備考</div>
            <a class="cardHeaderIcon">
                <span id="noteArrow" class="arrowDown"></span>
            </a>
        </div>
        <div id="note" class="cardBody">
            <div class="cardTable">
                <textarea id="note0" class="cardTableContent" rows="1">${enemyData.note}</textarea>
            </div>
        </div>
    `
    return result
    //技欄は後で作成する(クソ設計でごめん)
}
function createElementCheckBox(enemyData,boxName){//9属性のチェックボックスを作成する関数
    let result=""
    let isChecked=""
    for(let i in elementList){
        if(Boolean(enemyData.elements)===true){
            if(enemyData.elements.includes(elementList[i])){
                isChecked="checked"
            }else{
                isChecked=""
            }
        }
        const color=`style="color:${elementColorList[i]};"`//属性ラベルに属性色を付ける
        result+=`
            <div class="${boxName}">
                <label for="${boxName}-${i}" ${color}>${elementList[i]}</label>
                <input type="checkbox" id="${boxName}-${i}" ${isChecked}>
            </div>
        `
    }
    return result
}
function addSpecieBox(speciesArray){//種族を取得して、追加する関数
    const boxName="symbol-species"
    let result=""
    if(Boolean(speciesArray)===true){
        for(let i in speciesArray){
            result+=createSpeciesBox(speciesArray[i],i).content
            setDeleteButtonProcess(boxName,i)//削除ボタンに処理を適用する
        }
    }else{//データがないときの処理
        result+=createSpeciesBox().content//データがないとき、デフォルトで1枠作成しておく
        setDeleteButtonProcess(boxName,0)//削除ボタンに処理を適用する
    }
    setAddButtonProcess(boxName)//種族に追加ボタンの処理を適用する
    return result
}
function createSpeciesBox(species="",index=null){//追加する種族を作成する関数
    const idName="symbol-species-"
    let speciesIndex=0
    if(Boolean(index)===true){
        speciesIndex=index
    }else{//index引数が指定されていないなら、要素の最後の数をindexとして設定する
        speciesIndex=getFinalNumber(addedElementsIndex.species)
    }
    addedElementsIndex.species.push(Number(speciesIndex))
    let content=""
    content=`
        <div class="cardTableContent">
            <input type="text" id="symbol-species-${speciesIndex}" list="speciesList" value="${species}" autocomplete="off">
            ${createDataList("speciesList",speciesList)}
            <button id="deleteButton-symbol-species-${speciesIndex}" class="button deleteButton">削除</button>
            <div class=cardTableContent-add>系</div>
        </div>
    `
    const result={
        content:content,
        index:speciesIndex
    }
    return result
}
function createAddContent(boxName){//boxNameに応じて追加する中身を作成する関数
    const boxId=document.getElementById(`${boxName}-content`)
    let gottenObject=new Object
    let content=""
    let index=0
    switch(boxName){//boxNameに合わせて追加する中身を変更する
        case "symbol-species":
            gottenObject=createSpeciesBox()
            break
        case "ability":
            gottenObject=createAbilityBox()
            break
        default:
            break
    }
    content=gottenObject.content
    index=gottenObject.index
    const contentElement=stringToHTML(content)
    boxId.appendChild(contentElement)//要素を追加する
    setDeleteButtonProcess(boxName,index)//削除ボタンの処理を適用する
}
function setAddButtonProcess(boxName){//プロパティの追加ボタン処理を適用する処理
    $(document).on("click",`#addButton-${boxName}`,function(){//追加ボタンの処理
        createAddContent(boxName)
    })
}
function setDeleteButtonProcess(boxName,index){//プロパティの削除ボタン処理を適用する処理
    const contentName=`${boxName}-${index}`
    $(document).on("click",`#deleteButton-${contentName}`,function(){//削除ボタンの処理
        let deleteTarget
        const contentId=document.getElementById(contentName)
        switch(boxName){
            case "symbol-species":
                deleteTarget=contentId.parentNode//親要素(.cardTableContent)ごと削除する
                break
            case "ability":
                deleteTarget=contentId
                break
            default:
                break
        }
        deleteTarget.remove()
    })
}
function createStealthSelect(stealth){//隠密のセレクトボックスのoptionを作成する関数
    const selection=["","",""]
    switch(convertPercent(stealth)){
        case "不明":
        case "":
            selection[0]="selected"
            break
        case "有効":
            selection[1]="selected"
            break
        case "無効":
            selection[2]="selected"
            break
        default:
            break
    }
    let result=""
    result=`
        <option value="不明" ${selection[0]}>不明</option>
        <option value="有効" ${selection[1]}>有効</option>
        <option value="無効" ${selection[2]}>無効</option>
    `
    return result
}
function getInputEnemyData(){//入力フォームからデータを取得する関数
    const result=JSON.parse(JSON.stringify(emptyData))//値渡しでデータを受け取る
    if(Page!=="edit"){return}
    result.name=document.getElementById("symbol-name").value
    result.level=NumberOrEmpty(document.getElementById("symbol-level").value)
    result.tag=document.getElementById("symbol-tag").value
    result.elements=getElements()
    result.species=getSpecies()
    result.sanCheck.success=document.getElementById("symbol-parameter-sanCheck-success").value
    result.sanCheck.failure=document.getElementById("symbol-parameter-sanCheck-failure").value
    result.HP=NumberOrEmpty(document.getElementById("symbol-parameter-HP").value)
    result.armor=NumberOrEmpty(document.getElementById("symbol-parameter-armor").value)
    result.initiative=NumberOrEmpty(document.getElementById("symbol-parameter-initiative").value)
    result.actionPoint=NumberOrEmpty(document.getElementById("symbol-parameter-actionPoint").value)
    result.dodge=NumberOrEmpty(document.getElementById("symbol-parameter-dodge").value)
    result.actionNumber=NumberOrEmpty(document.getElementById("symbol-parameter-actionNumber").value)
    result.statusEffects.flame=NumberOrEmpty(document.getElementById("statusEffects-flame").value)
    result.statusEffects.ice=NumberOrEmpty(document.getElementById("statusEffects-ice").value)
    result.statusEffects.dazzle=NumberOrEmpty(document.getElementById("statusEffects-dazzle").value)
    result.statusEffects.poison=NumberOrEmpty(document.getElementById("statusEffects-poison").value)
    result.statusEffects.sleep=NumberOrEmpty(document.getElementById("statusEffects-sleep").value)
    result.statusEffects.confusion=NumberOrEmpty(document.getElementById("statusEffects-confusion").value)
    result.statusEffects.stun=NumberOrEmpty(document.getElementById("statusEffects-stun").value)
    result.statusEffects.curse=NumberOrEmpty(document.getElementById("statusEffects-curse").value)
    result.statusEffects.atkDown=NumberOrEmpty(document.getElementById("statusEffects-atkDown").value)
    result.statusEffects.defDown.physical=NumberOrEmpty(document.getElementById("statusEffects-defDown-physical").value)
    result.statusEffects.defDown.breath=NumberOrEmpty(document.getElementById("statusEffects-defDown-breath").value)
    result.statusEffects.defDown.magic=NumberOrEmpty(document.getElementById("statusEffects-defDown-magic").value)
    result.statusEffects.spdDown=NumberOrEmpty(document.getElementById("statusEffects-spdDown").value)
    result.statusEffects.spdDown=NumberOrEmpty(document.getElementById("statusEffects-spdDown").value)
    result.stealth=convertValueToPercent(document.getElementById("statusEffects-stealth").value)
    result.abilities=getAbilities()
    result.moves=getMoves()
    result.note=document.getElementById("note0").value
    function getElements(){//入力フォームから敵の属性データを取得する関数
        const result=new Array
        for(let i=0;i<elementList.length;i++){
            if(document.getElementById(`symbol-element-${i}`).checked){
                result.push(elementList[i])
            }
        }
        return result
    }
    function getSpecies(){//入力フォームから敵の種族データを取得する関数
        const result=new Array
        const speciesElements=$('input[id^="symbol-species-"]')
        for(let i=0;i<speciesElements.length;i++){
            result.push(speciesElements[i].value);
        }
        return result
    }
    function getAbilities(){//入力フォームから敵の特性データを取得する関数
        const result=new Array
        const abilitiesElements=$('textarea[id^="ability-effect"]')
        for(let i=0;i<abilitiesElements.length;i++){
            const newAbility={
                name:"",
                effect:""
            }
            newAbility.name=abilitiesElements[i].parentNode.parentNode.querySelector(".cardTable-ability-name").querySelector(".cardTableContent").value
            newAbility.effect=abilitiesElements[i].value
            result.push(newAbility);
        }
        return result
    }
    function getMoves(){//入力フォームから敵の技データを取得する関数
        function getMoveCheckBox(parentElement,className,list){//技のチェックボックスを取得する関数
            const listElement=parentElement.querySelectorAll(`${className} input`)
            const result=new Array
            if(list.length===listElement.length){
                for(let j=0;j<listElement.length;j++){
                    if(listElement[j].checked){
                        result.push(list[j])
                    }
                }
            }
            return result
        }
        const result=new Array
        const movesElement=document.querySelector(".move-content").children
        for(let i=0;i<movesElement.length;i++){//技単位でループ
            const newMove=new Object
            newMove.index=NumberOrEmpty(movesElement[i].querySelector("div.cardTable-move-index > input").value)
            newMove.name=movesElement[i].querySelector("div.cardTable-move-name > input").value
            newMove.elements=getMoveCheckBox(movesElement[i],".move-element",elementList)//属性を取得する
            newMove.types=getMoveCheckBox(movesElement[i],".move-type",attackTypeList)//攻撃種別を取得する
            newMove.reach=NumberOrEmpty(movesElement[i].querySelector("div.cardTable-move-reach > input").value)
            newMove.canDiagonal=movesElement[i].querySelector(".move-canDiagonal input").checked
            newMove.range=movesElement[i].querySelector("div.cardTable-move-range > input").value
            newMove.successRate=NumberOrEmpty(movesElement[i].querySelector("div.cardTable-move-successRate > input").value)
            newMove.attackNumber=movesElement[i].querySelector("div.cardTable-move-attackNumber > input").value
            newMove.damage=movesElement[i].querySelector("div.cardTable-move-damage > input").value
            const statusEffects=new Array
            let statusEffectsElement
            try{
                statusEffectsElement=movesElement[i].querySelector(".cardTable-move-statusEffect-value").children
                for(let j=0;j<statusEffectsElement.length;j++){//状態異常単位でループ
                    const newStatusEffect=new Object
                    newStatusEffect.effectType=statusEffectsElement[j].querySelector(".cardTable-move-statusEffect-type").value
                    let statusEffectLevel=0
                    if(!statusEffectWithoutLevelList.includes(newStatusEffect.effectType)){
                        statusEffectLevel=NumberOrEmpty(statusEffectsElement[j].querySelector(".cardTable-move-statusEffect-level").value)
                    }
                    newStatusEffect.level=statusEffectLevel
                    newStatusEffect.turn=NumberOrEmpty(statusEffectsElement[j].querySelector(".cardTable-move-statusEffect-turn").value)
                    statusEffects.push(newStatusEffect)
                }
            }catch(error){}
            newMove.statusEffects=statusEffects
            const effects=new Array
            const effectsElement=movesElement[i].querySelectorAll(".cardTable-move-effect textarea.cardTableContent")
            for(let j=0;j<effectsElement.length;j++){//効果単位でループ
                effects.push(effectsElement[j].value)
            }
            newMove.effects=effects
            result.push(newMove)
        }
        return result
    }
    return result
}
function getReplacedData(data,key,enemyData){//データの一部を置換する関数
    const result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    result.enemy.splice(key,1,enemyData)//指定されたデータを置換する
    return result
}
function getInputData(data){//入力されたデータを含む全体のデータを取得する関数
    const gottenEnemyData=getInputEnemyData()
    const replacedData=getReplacedData(data,Index,gottenEnemyData)
    return replacedData
}
function saveEditData(data){//入力したデータを保存する関数
    const inputData=getInputData(data)
    delete inputData.isNotSaved//未保存のデータであるというプロパティを削除する
    dataBase_update(dataBaseUrl,inputData,firebaseIdToken)//jsonファイルを上書き更新する
    alert("保存しました")
}
function saveByShortCutKey(data){//ショートカットキーで保存する処理を適用する関数
    document.addEventListener("keydown",keydownEvent)
    function keydownEvent(event){
        const code=(event.keyCode ? event.keyCode : event.which)
        if(!((code===83)&&(event.ctrlKey)))return true
        event.preventDefault()// ctrl+S に割り当てられているデフォルトの機能を無効化します。
        saveEditData(data)
        return false
    }
}

/* htmlのふるまいを適用する関数 */
function updateAllTextarea(idName){//全てのtextareaの初期値に合わせてそれぞれ高さを自動調整する関数
    const textareaList = $(`textarea[id^="${idName}"]`);
    textareaList.each(function(i, elem) {
        updateTextarea(`#${$(elem).attr("id")}`)
    });
}
function updateTextarea(textareaId){//textareaの初期値に合わせて高さを自動調整する関数
    $(function(){
        const targetArea = $(textareaId);
        const rawTarget = targetArea.get(0);
        // console.log(textareaId)
        // console.log(targetArea)
        // console.log(rawTarget)
        let lineHeight = Number(targetArea.attr("rows"));
        while (rawTarget.scrollHeight > rawTarget.offsetHeight){
            lineHeight++;
            targetArea.attr("rows", lineHeight);
        }
    });
}
function setAccordionMenu(className){//アコーディオンメニューを実装する関数
    $(document).on("click",className,function(){
        const target=$(this).data("target")//[data-target]の属性値を代入する
        const idName="#"+target//[target]と同じ名前のID
        $(idName).slideToggle(0)//[target]と同じ名前のIDを持つ要素に[slideToggle()]を実行する
        const arrowIcon=$(`#${target}Arrow`)//矢印アイコンの要素
        toggleArrowIcon(arrowIcon,target)//トグルを記憶して矢印アイコンを切り替える
    })
}
function getArrowIcon(toggle){//アコーディオンメニューに使う矢印アイコンを表示する関数
    let result=""
    if(toggle){//アコーディオンメニューが開いているとき
        result="arrowDown"
    }else{//アコーディオンメニューが閉じているとき
        result="arrowLeft"
    }
    return result
}
function toggleArrowIcon(arrowIcon,target){//矢印アイコンを切り替える関数
    switch(target){
        case "symbol":
            $(arrowIcon).addClass(getArrowIcon(!isOpenList.symbol))
            $(arrowIcon).removeClass(getArrowIcon(isOpenList.symbol))
            isOpenList.symbol=!isOpenList.symbol
            break
        case "statusEffects":
            $(arrowIcon).addClass(getArrowIcon(!isOpenList.resistance))
            $(arrowIcon).removeClass(getArrowIcon(isOpenList.resistance))
            isOpenList.resistance=!isOpenList.resistance
            break
        case "ability":
            $(arrowIcon).addClass(getArrowIcon(!isOpenList.ability))
            $(arrowIcon).removeClass(getArrowIcon(isOpenList.ability))
            isOpenList.ability=!isOpenList.ability
            break
        case "move":
            $(arrowIcon).addClass(getArrowIcon(!isOpenList.move))
            $(arrowIcon).removeClass(getArrowIcon(isOpenList.move))
            isOpenList.move=!isOpenList.move
            break
        case "note":
            $(arrowIcon).addClass(getArrowIcon(!isOpenList.note))
            $(arrowIcon).removeClass(getArrowIcon(isOpenList.note))
            isOpenList.note=!isOpenList.note
            break
    }
}
function setAutoAdjustTextarea(target){//textareaの入力時に縦幅を自動調整する処理を適用する関数
    $(document).on("keyup",target,function(){
        $(this).height(0).innerHeight(this.scrollHeight)
    })
}

/* データを編集・出力する関数 */
function deleteEnemyPiece(key,data){//jsonのデータを削除する関数
    let result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    for(let i=0;i<result.enemy.length;i++){//いちいち全部のデータを参照しようとするので重い 改善するべき設計
        if(result.enemy[i].index===key){
            result.enemy.splice(i,1)//削除する
            break
        }
    }
    dataBase_update(dataBaseUrl,result,firebaseIdToken,"reload")//データベースを削除されたデータで上書きする
}
function exportEnemyPiece(enemyData){//敵コマをクリップボードに出力する関数
    let result=""
    result=convertJsonToPiece(enemyData)
    exportToClipboard(result)//クリップボードに出力
    alert("敵データをクリップボードに出力しました。")
}
function convertJsonToPiece(enemyData){//Jsonデータをココフォリアコマ形式に変換する関数
    let result=""
    const ccfoliaPiece={//ココフォリアコマの枠組み
        kind:"character",
        data:{
            name:"",
            memo:"",
            initiative:0,
            externalUrl:"",
            status:[
                {label:"HP",value:0,max:0},
                {label:"行動P",value:0,max:0},
                {label:"装甲",value:0,max:0}
            ],
            params:[
                {label:"回避技能",value:`${convertProperty(enemyData.dodge)}`}
            ],
            iconUrl:"",
            faces:[],
            x:0,y:0,angle:0,width:4,height:4,
            active:true,secret:false,invisible:false,hideStatus:false,
            color:"#888888",
            commands:"",
            owner:""
        }
    }
    //ccfoliaPieceにデータを代入していく
    ccfoliaPiece["data"]["name"]=(enemyData.name+addValue(enemyData.level," レベル","",0)).trimStart()
    ccfoliaPiece["data"]["initiative"]=enemyData.initiative
    ccfoliaPiece["data"]["status"][0]["value"]=ccfoliaPiece["data"]["status"][0]["max"]=enemyData.HP
    ccfoliaPiece["data"]["status"][1]["value"]=enemyData.actionPoint
    ccfoliaPiece["data"]["status"][2]["value"]=enemyData.armor
    ccfoliaPiece["data"]["commands"]=getChatPalette(enemyData)
    //代入したデータを出力する
    result=JSON.stringify(ccfoliaPiece)
    return result
}
function getChatPalette(enemyData){//出力するココフォリアコマのチャットパレットを作成する関数
    let result=""
    const separateBar="―――――――――――――――――"
    const subSeparateBar="― ― ― ― ― ― ― ― ― ― ― ― ―"
    const chatPalette={
        sanCheck:[`SANチェック ${convertProperty(enemyData.sanCheck.success)}/${convertProperty(enemyData.sanCheck.failure)}`],
        ability:getAbilitiesAsCcfoliaData(enemyData,subSeparateBar),
        controller:[
            ":HP+",
            ":HP-",
            `CCB<=${convertProperty(enemyData.dodge)} 【回避】`,
            `CCB<=${convertProperty(enemyData.dodge)}/`,
            `1d${getAmbiguousArrayLength(enemyData.moves)} 攻撃方法`
        ],
        move:getMovesAsCcfoliaData(enemyData.moves,subSeparateBar)
    }
    if(checkHaveDisruptiveWave(enemyData.moves))chatPalette.controller.push(`1d${getAmbiguousArrayLength(enemyData.moves)-1} 攻撃方法`)//いてつく波動波動持ちのとき、いてつく波動なしの攻撃方法選択チャパレを作成する
    const sections=new Array
    for(let key in chatPalette){
        if(chatPalette[key]===""){continue}//セクションに何もないなら処理をしない
        sections.push(addDotToArray(chatPalette[key],"\n"))
    }
    result=addDotToArray(deleteValueInArray(sections,""),"\n"+separateBar+"\n")
    return result
}
function getAbilitiesAsCcfoliaData(enemyData,subSeparateBar){//ココフォリアコマの特性欄を作成する関数
    const result=new Array
    const abilities={
        feature:[
            `${convertProperty(addDotToArray(deleteValueInArray(enemyData.elements,""),"・"))}属性`,
            `${addDotToArray(addValueToArray(deleteValueInArray(enemyData.species,""),"系"),"・")}`,
            `AI${convertProperty(enemyData.actionNumber)}回行動`
        ],
        resistance_statusEffect:[
            `${convertPercent(enemyData.statusEffects.flame,"炎",true,true)}`,
            `${convertPercent(enemyData.statusEffects.ice,"氷",true,true)}`,
            `${convertPercent(enemyData.statusEffects.dazzle,"幻惑",true,true)}`,
            `${convertPercent(enemyData.statusEffects.poison,"毒",true,true)}`,
            `${convertPercent(enemyData.statusEffects.sleep,"眠り",true,true)}`,
            `${convertPercent(enemyData.statusEffects.confusion,"混乱",true,true)}`,
            `${convertPercent(enemyData.statusEffects.stun,"スタン",true,true)}`,
            `${convertPercent(enemyData.statusEffects.curse,"呪い",true,true)}`
        ],
        resistance_parameterDown:[
            `${convertPercent(enemyData.statusEffects.atkDown,"攻撃力低下",true,true)}`,
            `${convertPercent(enemyData.statusEffects.defDown.physical,"物理防御力低下",true,true)}`,
            `${convertPercent(enemyData.statusEffects.defDown.breath,"息防御力低下",true,true)}`,
            `${convertPercent(enemyData.statusEffects.defDown.magic,"魔法防御力低下",true,true)}`,
            `${convertPercent(enemyData.statusEffects.spdDown,"素早さ低下",true,true)}`
        ]
    }
    if(enemyData.stealth==="無効"){
        abilities["feature"].push("隠密無効")
    }
    for(let key in abilities){
        result.push(addDotToArray(deleteValueInArray(abilities[key],""),","))
    }
    if(Boolean(enemyData.abilities)===true){//特性があるときの処理
        for(let i in enemyData.abilities){
            result.push(subSeparateBar)
            if(enemyData.abilities[i].name!=="")result.push(`『${convertProperty(enemyData.abilities[i].name)}』`)
            result.push(convertProperty(enemyData.abilities[i].effect))
        }
    }
    if(Boolean(enemyData.note)===true){//備考欄があるときの処理
        result.push(subSeparateBar)
        result.push(enemyData.note)
    }
    return deleteValueInArray(result,"")
}
function getMovesAsCcfoliaData(moves,subSeparateBar){//ココフォリアコマの技欄を作成する関数
    const result=new Array
    const sortedMoves=getSortedMoves(moves)
    for(let i in sortedMoves){
        //間を区切る
        if(Number(i)!==0){result.push(subSeparateBar)}
        //技番号と名前
        result.push(`【${convertProperty(sortedMoves[i].index)}】『${convertProperty(sortedMoves[i].name)}』`)
        //射程と範囲
        const reachRange=new Array
        if((Number(sortedMoves[i].reach)!==0)||(sortedMoves[i].reach==="")){
            reachRange.push(`射程${viewReach(convertProperty(sortedMoves[i].reach),sortedMoves[i].canDiagonal)}`)
        }
        if(sortedMoves[i].range!==""){
            reachRange.push(sortedMoves[i].range)
        }
        result.push(addDotToArray(reachRange,","))
        //状態異常
        for(let j in sortedMoves[i].statusEffects){
            result.push(`${convertProperty(sortedMoves[i].statusEffects[j].effectType)}${hideTheZeroProperty(sortedMoves[i].statusEffects[j].level,`Lv${convertProperty(sortedMoves[i].statusEffects[j].level)}`)}${hideTheZeroProperty(sortedMoves[i].statusEffects[j].turn,`(${convertProperty(sortedMoves[i].statusEffects[j].turn)}ターン)`)}`)
        }
        //技効果
        for(let j in sortedMoves[i].effects){
            result.push(convertProperty(sortedMoves[i].effects[j]))
        }
        //攻撃ロール
            if(isNaN(Number(sortedMoves[i].attackNumber))===true){//"2d3"など、攻撃回数が数値ではないとき
                result.push(`${convertProperty(sortedMoves[i].attackNumber)} 【攻撃回数(${convertProperty(sortedMoves[i].name)})】`)
                result.push(`B100<=${convertProperty(sortedMoves[i].successRate)} 【${convertProperty(sortedMoves[i].name)}】`)
            }else{//攻撃回数が純粋な数値のとき
                if((Number(sortedMoves[i].attackNumber)>0)&&((Number(sortedMoves[i].successRate)<100))){//攻撃回数が1未満や成功率が100%のとき、攻撃ロールは表示しない
                    if(Number(sortedMoves[i].attackNumber)>1){//攻撃回数が1回ならCCBで判定
                        result.push(`${convertProperty(sortedMoves[i].attackNumber)}B100<=${convertProperty(sortedMoves[i].successRate)} 【${convertProperty(sortedMoves[i].name)}】`)
                    }else{//攻撃回数が複数ならxB100で判定
                        result.push(`CCB<=${convertProperty(sortedMoves[i].successRate)} 【${convertProperty(sortedMoves[i].name)}】`)
                    }
                }
            }
        //ダメージロール
        if(Number(sortedMoves[i].damage)!==0){
            result.push(`${convertProperty(sortedMoves[i].damage)} 【ダメージ(${convertProperty(sortedMoves[i].name)})】`)
        }
    }
    return deleteValueInArray(result,"")
}
function downloadJson(data,idName,convertText=false){//jsonのデータをダウンロードする関数
    let sortedData
    let dataString=""
    let blob
    let mime
    let fileName="data"
    if(convertText===false){//jsonでダウンロード
        sortedData=getSortedEnemyObject(data)
        dataString=JSON.stringify(sortedData)
        mime="application/json"
        fileName+=".json"
    }else if(convertText===true){//txtでダウンロードする場合
        const tagFilter=$("#searchTag").val()//タグ検索ボックスに入力された値
        const nameFilter=$("#searchName").val()//名前検索ボックスに入力された値
        sortedData=getSortedEnemyObject(data,tagFilter,nameFilter)//敵データにフィルターをかけて取得する
        for(let i in sortedData.enemy){//jsonデータをtxt形式に変換する
            dataString+=convertJsonToText(sortedData.enemy[i])+"\n\n"
        }
        mime="text/plain"
        fileName+=".txt"
    }else{return}//例外処理
    blob=new Blob([dataString],{"type":mime})
    if (window.navigator.msSaveBlob){//IE,Edge
        window.navigator.msSaveBlob(blob,fileName); 
        //msSaveOrOpenBlobの場合はファイルを保存せずに開ける
        window.navigator.msSaveOrOpenBlob(blob,fileName); 
    }else{//Chrome, FireFox
        const downloadUrl=window.URL.createObjectURL(blob)
        $(idName).attr("href",downloadUrl)
    }
}
function convertJsonToText(enemyData){//jsonデータをtxt形式に変換する関数
    let result=""
    const row0=[//名前・レベル
        `${convertProperty(enemyData.name)}`,
        `Lv${convertProperty(enemyData.level)}`
    ]
    const row1=[//SAN喪失
        `SANチェック${convertProperty(enemyData.sanCheck.success)}/${convertProperty(enemyData.sanCheck.failure)}`
    ]
    const row2=[//属性・種族
        `${convertProperty(addDotToArray(deleteValueInArray(enemyData.elements,""),"・"))}属性`,
        `${addDotToArray(addValueToArray(deleteValueInArray(enemyData.species,""),"系"),"・")}`
    ]
    const row3=[//パラメータ
        `HP${convertProperty(enemyData.HP)}`,
        `装甲${convertProperty(enemyData.armor)}`,
        `DEX${convertProperty(enemyData.initiative)}`,
        `行動p${convertProperty(enemyData.actionPoint)}`,
        `回避${convertProperty(enemyData.dodge)}%`,
        `行動回数${convertProperty(enemyData.actionNumber)}回`,
        `${convertPercent(enemyData.stealth,"隠密",true)}`
    ]
    const row4=[//状態異常耐性
        `${convertPercent(enemyData.statusEffects.flame,"炎",true)}`,
        `${convertPercent(enemyData.statusEffects.ice,"氷",true)}`,
        `${convertPercent(enemyData.statusEffects.dazzle,"幻惑",true)}`,
        `${convertPercent(enemyData.statusEffects.poison,"毒",true)}`,
        `${convertPercent(enemyData.statusEffects.sleep,"眠り",true)}`,
        `${convertPercent(enemyData.statusEffects.confusion,"混乱",true)}`,
        `${convertPercent(enemyData.statusEffects.stun,"スタン",true)}`,
        `${convertPercent(enemyData.statusEffects.curse,"呪い",true)}`
    ]
    const row5=[//パラメータ低下耐性
        `${convertPercent(enemyData.statusEffects.atkDown,"攻撃力低下",true)}`,
        `${convertPercent(enemyData.statusEffects.defDown.physical,"物理防御力低下",true)}`,
        `${convertPercent(enemyData.statusEffects.defDown.breath,"息防御力低下",true)}`,
        `${convertPercent(enemyData.statusEffects.defDown.magic,"魔法防御力低下",true)}`,
        `${convertPercent(enemyData.statusEffects.spdDown,"素早さ低下",true)}`
    ]
    const row6=[//備考
        enemyData.note
    ]
    const row7=new Array//特性
    for(let i in enemyData.abilities){
        if(enemyData.abilities[i].name===""){
            row7.push(`[${convertProperty(convertString(enemyData.abilities[i].effect,"\n"))}]`)
        }else{
            row7.push(`${convertProperty(enemyData.abilities[i].name)}[${convertProperty(convertString(enemyData.abilities[i].effect,"\n"))}]`)
        }

    }
    const row8=getMovesAsText(enemyData)//技
    const rowAll=[row0,row1,row2,row3,row4,row5,row6,row7,row8]
    for(let i in rowAll){
        const row=deleteValueInArray(rowAll[i],"")
        if(row.length<1){continue}//行に何もないなら処理をしない
        if(Number(i)!==0){result+="\n"}
        if((JSON.stringify(rowAll[i])===JSON.stringify(row7))||(JSON.stringify(rowAll[i])===JSON.stringify(row8))){//特性や技のときの処理
            result+=addDotToArray(row,"\n")
        }else{
            result+=addDotToArray(row,",")
        }
    }
    return result
}
function importJson(importElement){//受け取ったjsonのデータを読み込む関数
    const data=importElement.files[0]//受け取ったデータ
    fileReader.readAsText(data)//テキストデータとして読み込む
    fileReader.onload=function(){//インポートしたファイルを読み込み追えたときの処理
        const data=fileReader.result
        let jsonData=null
        try{
            jsonData=JSON.parse(data)//jsonデータに変換する
        }catch(error){//エラー時の処理
            alert("json形式のデータをインポートしてください。")
        }finally{
            if(Boolean(jsonData)===true){//例外が起こらずにデータを正しく受け取れた場合の処理
                dataBase_update(dataBaseUrl,jsonData,firebaseIdToken,"reload")//データを読み込んで表示する
            }
        }
    }
}
function fileDrop(){//ファイルのドラッグ&ドロップ処理を実装する関数
    const ddarea = document.getElementById("import");

        // ドラッグされたデータが有効かどうかチェック
    const isValid = e => e.dataTransfer.types.indexOf("Files") >= 0;

    const ddEvent = {
        "dragover" : e=>{
            e.preventDefault(); // 既定の処理をさせない
            if( !e.currentTarget.isEqualNode( ddarea ) ) {
                    // ドロップエリア外ならドロップを無効にする
                e.dataTransfer.dropEffect = "none";return;
            }
            e.stopPropagation(); // イベント伝播を止める

            if( !isValid(e) ){
                    // 無効なデータがドラッグされたらドロップを無効にする
                e.dataTransfer.dropEffect = "none";return;
            }
                    // ドロップのタイプを変更
            e.dataTransfer.dropEffect = "copy";
            ddarea.classList.add("ddefect");
        },
        "dragleave" : e=>{
            if( !e.currentTarget.isEqualNode( ddarea ) ) {
                return;
            }
            e.stopPropagation(); // イベント伝播を止める
            ddarea.classList.remove("ddefect");
        },
        "drop":e=>{
            e.preventDefault(); // 既定の処理をさせない
            e.stopPropagation(); // イベント伝播を止める

            const files = e.dataTransfer;
            importJson(files)//ファイルを読み込む処理

            ddarea.classList.remove("ddefect");
        }
    };

    Object.keys( ddEvent ).forEach( e=>{
        ddarea.addEventListener(e,ddEvent[e]);
        document.body.addEventListener(e,ddEvent[e])
    });
}

/* デバッグ用処理 */
if(false)document.addEventListener("keyup",keyupEvent)
function keyupEvent(event){
    if(event.ctrlKey){//Ctrlキー同時押し
        switch(event.keyCode){
            case 13://Enterキーが押されたとき
                //デフォルトデータをぶちこむ
                sendDefaultData()
                break
            case 46://Deleteキーが押されたとき
                //データを全消ししてリロード
                dataBase_delete(firebaseIdToken,"reload")
                break
            case 32://Spaceキーが押されたとき
                //ユーザー選択(未実装)
                setUser()
                dataBase_get(dataBaseUrl)
                break
        }
    }
}
function sendDefaultData(){//ローカルのjsonデータをサーバーにアップロードする
    $(function(){
        $.ajax({
            url:"./../data.json",//jsonファイルの場所
            dataType:"json",// json形式でデータを取得
        })
        .done(function(data){
            dataBase_update(dataBaseUrl,data,firebaseIdToken,"reload")
        })
    })
}

/* ここから実際の処理 */
firebase.auth().onAuthStateChanged((user)=>{//認証処理終了後の処理
    if(user){
        // ユーザーが認証されている場合
        user.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Firebase ID トークンが取得された場合の処理
            // idToken 変数に Firebase ID トークンが含まれます
            console.log("Firebase ID トークン:", idToken);
            firebaseIdToken = idToken

            setUser(user.displayName,user.uid)
            main()
        }).catch((error) => {
            // Firebase ID トークンの取得中にエラーが発生した場合の処理
            console.error("Firebase ID トークンの取得中にエラーが発生しました:", error);
        });
    }else{//非ログイン時の処理
        location.href=loginPage//ログインページにリダイレクトする
    }
})
function main(){
    dataBase_get(dataBaseUrl)
}
