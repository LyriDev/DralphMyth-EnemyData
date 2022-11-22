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
const newData={
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
                {
                    effectType:"",
                    level:"",
                    turn:""
                }
            ],
            effects:[
            ]
        }
    ],
    note:""
}//新規データの枠組み
const fileReader=new FileReader()//File API

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
function convertAvailability(value){//有効/無効を〇/×に変換する関数
    if(value==="有効"){
        return "&#9675;"
    }else if(value==="無効"){
        return "&#10005;"
    }else if(value===""){
        return "&#8722;"
    }else{
        return ""
    }
}
function convertPercent(value,propertyName="",hideEffectiveProperty=false){//100を有効,0を無効,50を半減に変換する関数
    let result=""
    switch(String(value)){
        case "100":
            if(hideEffectiveProperty===true){return ""}//「有効」を隠す
            result="有効"
            break
        case "50":
            result="半減"
            break
        case "0":
            result="無効"
            break
        case "":
            if(hideEffectiveProperty===true){return ""}//「不明」も隠す
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
        valueList.push("")//消した空白文字を追加する
    }else{//空白文字を含まない場合
        valueList=valueList.sort()
    }
    return valueList
}
function setUrl(idName,url){//クリックしたらurlを開く処理を適用する関数
    $(document).on("mousedown",idName,function(event){
        switch(event.button){
            case 0://左クリックのときの処理
                location.href=url
                break
            case 1://中クリックのときの処理
                window.open(url,"_blank")
                break
            case 2://右クリックのときの処理
                break
            default:
                break
        }
    })
}
function exportToClipboard(value){//テキストデータをクリップボードに出力する関数
    if(navigator.clipboard){//サポートしているかを確認
        navigator.clipboard.writeText(value)//クリップボードに出力
    }
}

/* 種別リスト */

const attackTypeList=["物理","息","魔法"]

/* ページごとに表示するコンテンツを変更するための関数 */
function dataBase_get(url){//データベースのデータを取得する関数
    fetch(url).then(response=>response.json()).then(respondedData=>{
        updateHTML(respondedData)//HTMLを更新する
    })
}
function updateHTML(data){//HTMLを更新する関数
    try{
        if((Boolean(data))===true){
            updateTitle(data)//タイトルを変更する
            switchCssFile()//読み込むCSSファイルを差し替える
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
        titleArea.innerHTML=`${enemyName}Lv${enemyLevel} - ドラルフ神話`//タイトルを変更する
    }
}
function switchCssFile(_page=Page){//ページ毎に読み込むCSSファイルを変更する関数
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
                createButton_clickedProcess(data,event)
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
                <div id="headerButtonArea">
                    <button class="button" id="indexButton">一覧</button>
                    <button class="button" id="editButton"}>編集</button>
                    <button class="button" id="exportButton">出力</button>
                </div>
            </div id="headerContent">
            `
            setUrl("#indexButton",indexUrl)
            setUrl("#editButton",editUrl)
            $(document).on("click","#exportButton",function(){
                exportEnemyPiece(data.enemy[Index])//出力ボタン処理を適用する
            })
            break
        case "edit"://編集ページのヘッダー
            result=`
            <div id="headerContent">
                <div id="headerButtonArea">
                    <button class="button" id="indexButton">一覧</button>
                    <button class="button" id="viewButton">閲覧</button>
                    <button id="saveButton">保存</button>
                </div>
            </div>
            `
            $(document).on("mousedown","#indexButton",function(event){//一覧ボタンにクリック処理を適用する
                const inputData=getInputData(data)
                viewButton_clickedProcess(inputData,event,indexUrl)
            })
            $(document).on("mousedown","#viewButton",function(event){//閲覧ボタンにクリック処理を適用する
                const inputData=getInputData(data)
                viewButton_clickedProcess(inputData,event,viewUrl)
            })
            $(document).on("click","#saveButton",function(){//保存ボタンに処理を適用する
                const inputData=getInputData(data)
                dataBase_update(dataBaseUrl,inputData)//jsonファイルを上書き更新する
                alert("保存しました")
            })
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
                createButton_clickedProcess(data,event)
            })
            break
        default:
            break
    }
    document.getElementById("header").innerHTML=result
}
function createUserMenu(){//ユーザーメニューを作成する関数
    if(isLogin){//ログイン時のみ実行
        const userMenu=document.getElementById("userMenu")
        const userMenuContent=`
            <div id="userMenuContent">
                <div class="button" id="userButton">${user}</div>
                <button id="logoutButton" onclick="logout()">ログアウト</button>
            </div>
        `
        userMenu.innerHTML=userMenuContent

    }else{
        location.href=loginPage
    }
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
                <a class="button" id="downloadJson" href="#" ${downloadLink["json"]}>ダウンロード<br><div class="caption">(json形式)</div></a>
                <a class="button" id="downloadText" href="#" ${downloadLink["text"]}>ダウンロード<br><div class="caption">(text形式)</div></a>
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
            updateAllTextarea("ability-effect")
            updateAllTextarea("move-effect")
            updateTextarea("#note0")
            //textareaの初期値に合わせて高さを自動調整する
            setAccordionMenu(".cardHeader")//アコーディオンメニューを適用する
            break
        case "edit"://編集ページの際の処理
            setAccordionMenu(".cardHeader")//アコーディオンメニューを適用する
            break
        default:
            break
    }
}
function updateMainContent(content){//メインの中身を上書きする関数
    mainArea.innerHTML=content//メインの中身を変更する
}
function createButton_clickedProcess(data,event){//新規作成ボタンが押されたときの処理
    let result
    if(Boolean(data)===true){//データが入っているときの処理
        result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
        result.enemy.push(newData)//データに新規データを追加する
    }else{
        result={enemy:[]}//空データを作詞絵
        result.enemy.push(newData)//データに新規データを追加する
    }
    const newPageUrl=`${htmlUrl}?page=edit&index=${result.enemy.length-1}`
    switch(event.button){
        case 0://左クリックのときの処理
            dataBase_update(dataBaseUrl,result,"jump",newPageUrl)
            break
        case 1://中クリックのときの処理
            dataBase_update(dataBaseUrl,result,"open",newPageUrl)
            break
        case 2://右クリックのときの処理
            break
        default:
            break
    }

}
function viewButton_clickedProcess(data,event,url){//編集ページの一覧/閲覧ボタンが押されたときの処理
    let result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    switch(event.button){
        case 0://左クリックのときの処理
            dataBase_update(dataBaseUrl,result,"jump",url)
            break
        case 1://中クリックのときの処理
            dataBase_update(dataBaseUrl,result,"open",url)
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
        enemyArray.push(getEnemyDataByTag(gottenData,tagFilter,nameFilter,keyAddOption))//指定されたタグを持つデータのみを出力する
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
function getEnemyDataByTag(data,tagName,nameFilter,keyAddOption){//指定されたタグに合致する敵データを取得する関数
    let result=new Array
    let enemyArray=new Array
    $.each(data.enemy,function(key,value){
        if(tagName===value.tag){
            if(nameFilter===""){//名前フィルターなしのとき
                enemyArray.push({key:key,value:value})
            }else{//名前フィルターありのとき
                const nameFilterReg=new RegExp("^"+nameFilter+".*")//前方部分一致の正規表現
                if(nameFilterReg.test(value.name)){
                    enemyArray.push({key:key,value:value})
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
                const Key=enemyArray[j].key
                const Value=enemyArray[j].value
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
                <button class="button" id="deleteButton${key}")">削除</button>
            </div>
        </div>
    `
    const editUrl=`${htmlUrl}?page=edit&index=${key}`
    const viewUrl=`${htmlUrl}?page=view&index=${key}`
    setUrl(`#editButton${key}`,editUrl)
    setUrl(`#viewButton${key}`,viewUrl)
    $(document).on("click",`#exportButton${key}`,function(){
        exportEnemyPiece(enemyData)//出力ボタン処理を適用する
    })
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
        /* 成功率,攻撃回数,ダメージの表示 */
        if((Number(move.successRate)<100)||(move.successRate==="")){//成功率の表示
            content[1].push(`成功率${convertProperty(move.successRate)}%`)
        }
        if((String(move.attackNumber)!=="1")&&(String(move.attackNumber)!=="0")){//攻撃回数の表示
            content[1].push(`攻撃回数${convertProperty(move.attackNumber)}回`)
        }
        if((Number(move.damage)!==0)||(move.damage==="")){//ダメージの表示
            content[1].push(`ダメージ${convertProperty(move.damage)}`)
        }
        content[1]=addDotToArray(content[1],",")
        /* 射程,範囲の表示 */
        if((Number(move.reach)!==0)||(move.reach==="")){//射程の表示
            content[2].push(`射程${convertProperty(move.reach)}`)
        }
        if(move.range!==""){//範囲の表示
            content[2].push(move.range)
        }
        content[2]=addDotToArray(content[2],",")
        /* 状態異常の表示 */
        for(let k in move.statusEffects){
            content[3].push(`${convertProperty(move.statusEffects[k].effectType)}Lv${convertProperty(move.statusEffects[k].level)}(${convertProperty(move.statusEffects[k].turn)}ターン)`)
        }
        content[3]=addDotToArray(content[3],"\n"+indent)
        /* 効果の表示 */
        for(let k in move.effects){
            content[4].push(`${convertProperty(move.effects[k])}`)
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
                ${addAbilityBox(enemyDataValue)}
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
function addAbilityBox(enemyDataValue){//閲覧ページの特性欄を作成する関数
    let result=""
    let textareaNumber=0//textareaのidへ順番にインデックスをつける
    for(let i in enemyDataValue.abilities){
        const ability=enemyDataValue.abilities[i]
        result+=`
        <div class="cardTable">
            <div class="cardTable-ability-name">
                <div class="cardTableTitle">特性名</div>
                <input readonly type="text" class="cardTableContent" value="${ability.name}">
            </div>
            <div class="cardTable-ability-effect">
                <div class="cardTableTitle">効果</div>
                <textarea readonly id="ability-effect${textareaNumber}" class="cardTableContent" rows="1">${ability.effect}</textarea>
            </div>
        </div>
        `
        textareaNumber++
    }
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
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].reach}">
                    </div>
                    <div class="cardTable-move-range">
                        <div class="cardTableTitle">範囲</div>
                        <input readonly type="text" class="cardTableContent" value="${sortedMoves[i].range}">
                    </div>
                    <div class="cardTable-move-successRate">
                        <div class="cardTableTitle">成功率</div>
                        <input readonly type="text" class="cardTableContent" value="${addValue(sortedMoves[i].successRate,"%","")}">
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
    let textareaNumber=0//textareaのidへ順番にインデックスをつける
    for(let i in moveEffectArray){
        result+=`
            <textarea readonly id="move-effect${textareaNumber}" class="cardTableContent" rows="1">${moveEffectArray[i]}</textarea>
        `
        textareaNumber++
    }
    return result
}
function updateAllTextarea(idName){//全てのtextareaの初期値に合わせてそれぞれ高さを自動調整する関数
    const textareaList = $(`textarea[id^="${idName}"]`);
    for(let i=0;i<textareaList.length;i++){
        updateTextarea(`#${idName}${i}`)
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
        case "resistance":
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

/* 編集ページを表示中に使う関数 */
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
                    <div class="cardTableContent">
                        <label for="symbol-name">名前</label>
                        <input type="text" id="symbol-name" placeholder="おなまえ" value="${0}">
                    </div>
                    <div class="cardTableContent">
                        <label for="symbol-tag">タグ</label>
                        <input type="text" id="symbol-tag" value="${0}">
                    </div>
                    <div class="cardTableContent">
                        <label id="symbol-element">属性</label>
                        ${createElementCheckBox(enemyData,"symbol-element")}
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
                ${addAbilityBox(enemyData)}
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
                ${addMoveBox(enemyData)}
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
                <textarea readonly id="note0" class="cardTableContent" rows="1">${enemyData.note}</textarea>
            </div>
        </div>
    `
    return result
}
function createElementCheckBox(enemyData,boxName){//9属性のチェックボックスを作成する関数
    const elementList=["無","火","氷","風","土","雷","水","光","闇"]
    let result=""
    for(let i in elementList){
        result+=`
            <div class="${boxName}">
                <label for="${boxName}-${i}">${elementList[i]}</label>
                <input type="checkbox" id="${boxName}-${i}">
            </div>
        `
    }
    return result
}

function getInputEnemyData(){//入力フォームからデータを取得する関数
    //TODO 現在の入力内容を取得する処理
    if(Page!=="edit"){return}
    return newData
}
function getReplacedData(data,key,enemyData){//データの一部を置換する関数
    const result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    result.enemy.splice(key,1,enemyData)//指定されたデータを置換する
    return result
}
function getInputData(data){//入力されたデータを含む全体のデータをを取得する関数
    const gottenEnemyData=getInputEnemyData()
    const replacedData=getReplacedData(data,Index,gottenEnemyData)
    return replacedData
}

/* データを編集・出力する関数 */
function deleteEnemyPiece(key,data){//jsonのデータを削除する関数
    let result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    result.enemy.splice(key,1)//削除する
    dataBase_update(dataBaseUrl,result,"reload")//データベースを削除されたデータで上書きする
}
function exportEnemyPiece(enemyData){//敵コマをクリップボードに出力する関数
    let result=""
    result=convertJsonToPiece(enemyData)
    exportToClipboard(result)//クリップボードに出力
    alert("敵データをクリップボードに出力しました。")
}
function convertJsonToPiece(enemyData){//Jsonデータをココフォリアコマ形式に変換する関数
    //TODO 敵コマをココフォリアデータに変換する処理
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
                {label:"",value:""}
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
            `1d${enemyData.moves.length} 攻撃方法`
        ],
        move:getMovesAsCcfoliaData(enemyData.moves,subSeparateBar)
    }
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
            `${convertPercent(enemyData.statusEffects.flame,"炎",true)}`,
            `${convertPercent(enemyData.statusEffects.ice,"氷",true)}`,
            `${convertPercent(enemyData.statusEffects.dazzle,"幻惑",true)}`,
            `${convertPercent(enemyData.statusEffects.poison,"毒",true)}`,
            `${convertPercent(enemyData.statusEffects.sleep,"眠り",true)}`,
            `${convertPercent(enemyData.statusEffects.confusion,"混乱",true)}`,
            `${convertPercent(enemyData.statusEffects.stun,"スタン",true)}`,
            `${convertPercent(enemyData.statusEffects.curse,"呪い",true)}`
        ],
        resistance_parameterDown:[
            `${convertPercent(enemyData.statusEffects.atkDown,"攻撃力低下",true)}`,
            `${convertPercent(enemyData.statusEffects.defDown.physical,"物理防御力低下",true)}`,
            `${convertPercent(enemyData.statusEffects.defDown.breath,"息防御力低下",true)}`,
            `${convertPercent(enemyData.statusEffects.defDown.magic,"魔法防御力低下",true)}`,
            `${convertPercent(enemyData.statusEffects.spdDown,"素早さ低下",true)}`
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
            result.push(`『${convertProperty(enemyData.abilities[i].name)}』`)
            result.push(convertProperty(enemyData.abilities[i].effect))
        }
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
            reachRange.push(`射程${convertProperty(sortedMoves[i].reach)}`)
        }
        if(sortedMoves[i].range!==""){
            reachRange.push(sortedMoves[i].range)
        }
        result.push(addDotToArray(reachRange,","))
        //状態異常
        for(let j in sortedMoves[i].statusEffects){
            result.push(`${convertProperty(sortedMoves[i].statusEffects[j].effectType)}Lv${convertProperty(sortedMoves[i].statusEffects[j].level)}(${convertProperty(sortedMoves[i].statusEffects[j].turn)}ターン)`)
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
    const sortedData=getSortedEnemyObject(data)
    let dataString=""
    let blob
    let mime
    let fileName="data"
    if(convertText===false){//jsonでダウンロード
        dataString=JSON.stringify(sortedData)
        mime="application/json"
        fileName+=".json"
    }else if(convertText===true){//txtでダウンロードする場合
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
        `隠密${convertProperty(enemyData.stealth,"","不明")}`
    ]
    const row4=[//状態異常耐性
        `${convertPercent(enemyData.statusEffects.flame,"炎")}`,
        `${convertPercent(enemyData.statusEffects.ice,"氷")}`,
        `${convertPercent(enemyData.statusEffects.dazzle,"幻惑")}`,
        `${convertPercent(enemyData.statusEffects.poison,"毒")}`,
        `${convertPercent(enemyData.statusEffects.sleep,"眠り")}`,
        `${convertPercent(enemyData.statusEffects.confusion,"混乱")}`,
        `${convertPercent(enemyData.statusEffects.stun,"スタン")}`,
        `${convertPercent(enemyData.statusEffects.curse,"呪い")}`
    ]
    const row5=[//パラメータ低下耐性
        `${convertPercent(enemyData.statusEffects.atkDown,"攻撃力低下")}`,
        `${convertPercent(enemyData.statusEffects.defDown.physical,"物理防御力低下")}`,
        `${convertPercent(enemyData.statusEffects.defDown.breath,"息防御力低下")}`,
        `${convertPercent(enemyData.statusEffects.defDown.magic,"魔法防御力低下")}`,
        `${convertPercent(enemyData.statusEffects.spdDown,"素早さ低下")}`
    ]
    const row6=[//備考
        enemyData.note
    ]
    const row7=new Array//特性
    for(let i in enemyData.abilities){
        row7.push(`${convertProperty(enemyData.abilities[i].name)}[${convertProperty(convertString(enemyData.abilities[i].effect,"\n"))}]`)
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
                dataBase_update(dataBaseUrl,jsonData,"reload")//データを読み込んで表示する
            }
        }
    }
}

/* デバッグ用処理 */
document.addEventListener("keyup",keyupEvent);
function keyupEvent(event){
    switch(event.keyCode){
        case 13://Enterキーが押されたとき
            sendDefaultData()
            break
        case 46://Deleteキーが押されたとき
            dataBase_delete("reload")
            break
        case 32://Spaceキーが押されたとき
            setUser()
            dataBase_get(dataBaseUrl)
            break
    }
}
function sendDefaultData(){//ローカルのjsonデータをサーバーにアップロードする
    $(function(){
        $.ajax({
            url:"./../data.json",//jsonファイルの場所
            dataType:"json",// json形式でデータを取得
        })
        .done(function(data){
            dataBase_update(dataBaseUrl,data,"reload")
        })
    })
}

/* ここから実際の処理 */
window.addEventListener("load",()=>{//windowが読み込まれたとき
    dataBase_get(dataBaseUrl)
})