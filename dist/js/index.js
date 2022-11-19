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
const isOpenList={ability:true,move:true,note:true}//アコーディオンメニューが開いているかどうか
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

function convertProperty(value,target,alt){//null値などを代替テキストに変換する関数
    if(value===target){
        return alt
    }else{
        return value
    }
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

function addValue(value,add,negative){//値が否定条件に合致しなければ、値の後ろに要素を追加して返す関数
    if(value===negative){
        return value
    }else{
        return `${value}${add}`
    }
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

function exportToClipboard(value){
    if(navigator.clipboard){//サポートしているかを確認
        navigator.clipboard.writeText(value)//クリップボードに出力
    }
}

/* 種別リスト */
const elementList=["火","氷","風","土","雷","水","光","闇","無"]
const attackTypeList=["物理","息","魔法"]

/* ページごとに表示するコンテンツを変更するための関数 */
function updateHTML(data){//HTMLを更新する関数
    if((Boolean(data))===true){
        updateTitle(data)//タイトルを変更する
        switchCssFile()//読み込むCSSファイルを差し替える
        updateHeader(data)//ヘッダーを更新する
        updateMain(data)//メインを更新する
    }else{//データが入っていないときの処理
        updateHeader(data,"void")//ヘッダーを更新する
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
                    <button class="headerButton" id="createButton">新規作成</button>
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
                    <button class="headerButton" id="indexButton">一覧</button>
                    <button class="headerButton" id="editButton"}>編集</button>
                    <button class="headerButton" id="exportButton">出力</button>
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
                    <button class="headerButton" id="indexButton">一覧</button>
                    <button class="headerButton" id="viewButton">閲覧</button>
                    <button id="saveButton">保存</button>
                </div>
            </div>
            `
            $(document).on("mousedown","#indexButton",function(event){//一覧ボタンにクリック処理を適用する
                viewButton_clickedProcess(data,event,indexUrl)
            })
            $(document).on("mousedown","#viewButton",function(event){//閲覧ボタンにクリック処理を適用する
                viewButton_clickedProcess(data,event,viewUrl)
            })
            $(document).on("click","#saveButton",function(){//保存ボタンに処理を適用する
                saveJson(data)//jsonファイルを上書き更新する
                alert("保存しました")
            })
            break
        case "void"://データが何もない時のヘッダー
            result=`
                <div id="headerContent">
                    <input type="text" id="searchTag" placeholder="タグ検索">
                    <input type="text" id="searchName" placeholder="名前検索">
                    <div id="headerButtonArea">
                        <button class="headerButton" id="createButton">新規作成</button>
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
            setAccordionMenu(".cardHeader")//アコーディオンメニューを特性タブに適用する
            break
        case "edit"://編集ページの際の処理
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
    console.log(JSON.stringify(result))
    const newPageUrl=`${htmlUrl}?page=edit&index=${result.enemy.length-1}`
    switch(event.button){
        case 0://左クリックのときの処理
            dataBass_update(dataBaseUrl,result,"jump",newPageUrl)
            break
        case 1://中クリックのときの処理
            dataBass_update(dataBaseUrl,result,"open",newPageUrl)
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
            dataBass_update(dataBaseUrl,result,"jump",url)
            break
        case 1://中クリックのときの処理
            dataBass_update(dataBaseUrl,result,"open",url)
            break
        case 2://右クリックのときの処理
            break
        default:
            break
    }
}

/* 一覧ページを表示中に使う関数 */
//タグ>名前>レベル、の順番にソートされる仕様
function showEnemyData(data,tagFilter="",nameFilter=""){//表示する敵データを作成する関数
    let result=""
    if(tagFilter===""){//タグフィルターなしのとき
        let allEnemyTag=getAllEnemyTag(data)
        for(let i in allEnemyTag){//タグ毎にデータをまとめて出力する
            result+=getEnemyDataByTag(data,allEnemyTag[i],nameFilter)
        }
    }else{//タグフィルターありのとき
        result+=getEnemyDataByTag(data,tagFilter,nameFilter)//指定されたタグを持つデータのみを出力する
    }
    return result
}
function getAllEnemyTag(data){//敵データの全タグ種を取得する関数
    let enemyTagArray=new Array
    $.each(data.enemy,function(key,value){
        enemyTagArray.push(value.tag)
    })
    let enemyTagList=getTypeArray(enemyTagArray)
    return enemyTagList
}
function getEnemyDataByTag(data,tagName,nameFilter){//指定されたタグに合致する敵データを取得する関数
    let result=""
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
    result=getEnemyDataByName(enemyArray,data)
    return result
}
function getEnemyDataByName(enemyArray,data){//敵データを名前別に整理する関数
    let result=""
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
        result+=getEnemyDataByLevel(enemyArraySortedByName,data)
    }
    return result
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
function getEnemyDataByLevel(enemyArray,data){//敵データをレベル別に整理する関数
    let result=""
    const enemyLevelList=getEnemyLevelList(enemyArray)
    for(let i in enemyLevelList){
        for(let j in enemyArray){
            if(enemyArray[j].value.level===enemyLevelList[i]){
                result+=createEnemyElement(enemyArray[j],data)
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
    const name=enemyData.value.name
    const level=enemyData.value.level
    const tag=enemyData.value.tag
    let result=`
        <div class="data">
            <div class="name">${name}</div>
            <div class="level">Lv${convertProperty(level,"","?")}</div>
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
        exportEnemyPiece(enemyData.value)//出力ボタン処理を適用する
    })
    $(document).on("click",`#deleteButton${key}`,function(){
        deleteEnemyPiece(key,data)//削除ボタン処理を適用する
    })
    return result
}

/* 閲覧ページを表示中に使う関数 */
function viewEnemyData(enemyDataValue){//閲覧ページを作成する関数
    let result= `
        <div id="name">${enemyDataValue.name}&nbsp;Lv${convertProperty(enemyDataValue.level,"","?")}</div>
        <div id="tag">${enemyDataValue.tag}</div>
        <div class="parameterBox">
            <div>属性<br>${convertProperty(addDotToArray(deleteValueInArray(enemyDataValue.elements,""),"・"),"","?") }</div>
            <div>系統<br>${convertProperty(addDotToArray(addValueToArray(deleteValueInArray(enemyDataValue.species,""),"系"),"・"),"","?")}</div>
            <div>SANチェック<br>${convertProperty(enemyDataValue.sanCheck.success,"","?")}/${convertProperty(enemyDataValue.sanCheck.failure,"","?")}</div>
        </div>
        <div class="parameterBox">
            <div>HP<br>${convertProperty(enemyDataValue.HP,"","?")}</div>
            <div>装甲<br>${convertProperty(enemyDataValue.armor,"","?")}</div>
            <div>イニシアチブ<br>${convertProperty(enemyDataValue.initiative,"","?")}</div>
            <div>行動P<br>${convertProperty(enemyDataValue.actionPoint,"","?")}</div>
            <div>回避<br>${convertProperty(enemyDataValue.dodge,"","?")}%</div>
            <div>行動回数<br>${convertProperty(enemyDataValue.actionNumber,"","?")}回</div>
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
                <td>${convertProperty(enemyDataValue.statusEffects.flame,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.ice,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.dazzle,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.poison,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.sleep,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.confusion,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.stun,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.curse,"","?")}%</td>
                <td>${convertAvailability(enemyDataValue.stealth)}</td>
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
                <td>${convertProperty(enemyDataValue.statusEffects.atkDown,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.defDown.physical,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.defDown.breath,"","?")}%</td>
                <td>${convertProperty(enemyDataValue.statusEffects.defDown.magic,"","?")}%</td>
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
                <textarea readonly id="note0" class="cardTableContent" rows="1"></textarea>
            </div>
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
function addMoveBox(enemyDataValue){//閲覧ページの技欄を作成する関数
    const moveIndexList=new Array//全ての技番号
    for(let i in enemyDataValue.moves){
        const move=enemyDataValue.moves[i]
        moveIndexList.push(move.index)
    }
    const moveIndexTypeList=getTypeArray(moveIndexList)//技番号の種類一覧
    let result=""
    for(let i in moveIndexTypeList){//技番号順に並び変えて表示する
        for(let j in enemyDataValue.moves){
            const move=enemyDataValue.moves[j]
            if(move.index===moveIndexTypeList[i]){
                result+=`
                    <div class="cardTable">
                        <div class="clearFix">
                            <div class="cardTable-move-index">
                                <div class="cardTableTitle">技番号</div>
                                <input readonly type="text" class="cardTableContent" value="${move.index}">
                            </div>
                            <div class="cardTable-move-name">
                                <div class="cardTableTitle">技名</div>
                                <input readonly type="text" class="cardTableContent" value="${move.name}">
                            </div>
                            <div class="cardTable-move-element">
                                <div class="cardTableTitle">属性</div>
                                <input readonly type="text" class="cardTableContent" value="${addDotToArray(deleteValueInArray(move.elements,""),"・")}">
                            </div>
                            <div class="cardTable-move-type">
                                <div class="cardTableTitle">種別</div>
                                <input readonly type="text" class="cardTableContent" value="${addDotToArray(deleteValueInArray(move.types,""),"・")}">
                            </div>
                            <div class="cardTable-move-reach">
                                <div class="cardTableTitle">射程</div>
                                <input readonly type="text" class="cardTableContent" value="${move.reach}">
                            </div>
                            <div class="cardTable-move-range">
                                <div class="cardTableTitle">範囲</div>
                                <input readonly type="text" class="cardTableContent" value="${move.range}">
                            </div>
                            <div class="cardTable-move-successRate">
                                <div class="cardTableTitle">成功率</div>
                                <input readonly type="text" class="cardTableContent" value="${addValue(move.successRate,"%","")}">
                            </div>
                            <div class="cardTable-move-attackNumber">
                                <div class="cardTableTitle">攻撃回数</div>
                                <input readonly type="text" class="cardTableContent" value="${move.attackNumber}">
                            </div>
                            <div class="cardTable-move-damage">
                                <div class="cardTableTitle">ダメージ</div>
                                <input readonly type="text" class="cardTableContent" value="${move.damage}">
                            </div>
                        </div>
                        ${addMoveBox_statusEffect(move.statusEffects)}
                        ${addMoveBox_effect(move.effects)}
                    </div>
                `
            }
        }
    }
    return result
}
function addMoveBox_statusEffect(moveStatusEffectArray){//閲覧ページの技欄の状態異常欄を作成する関数
    if(moveStatusEffectArray.length===0){return ""}//状態異常がないなら欄を作らない
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

/* データを編集・出力する関数 */
function saveJson(data){//更新されたjsonファイルを保存する関数
    dataBass_update(dataBaseUrl,data)
}

function exportEnemyPiece(enemyData){//敵コマをクリップボードに出力する関数
    let result=""
    alert("敵データをクリップボードに出力しました。")
    result=JSON.stringify(enemyData)//仮処理
    //TODO 敵コマをココフォリアデータに変換する処理
    exportToClipboard(result)//クリップボードに出力
}
function deleteEnemyPiece(key,data){//jsonのデータを削除する関数
    let result=JSON.parse(JSON.stringify(data))//値渡しでデータを受け取る
    result.enemy.splice(key,1)//削除する
    dataBass_update(dataBaseUrl,result,"reload")//データベースを削除されたデータで上書きする
}

/* デバッグ用処理 */
document.addEventListener("keyup",keyupEvent);
function keyupEvent(event){
    switch(event.keyCode){
        case 13://Enterキーが押されたとき
            sendDefaultData()
            break
        case 46://Deleteキーが押されたとき
            dataBass_delete("reload")
            break
        case 32://Spaceキーが押されたとき
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
            dataBass_update(dataBaseUrl,data,"reload")
        })
    })
}

//

/* ここから実際の処理 */
function dataBass_get(url){//データベースのデータを取得する関数
    fetch(url).then(response=>response.json()).then(respondedData=>{
        updateHTML(respondedData)//HTMLを更新する
    })
}


window.addEventListener("load",()=>{//windowが読み込まれたとき
    dataBass_get(dataBaseUrl)
})