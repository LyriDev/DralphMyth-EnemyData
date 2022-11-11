function getAllEnemyTag(data){//敵データの全タグ種を取得する関数
    let enemyTagList=new Array
    $.each(data.enemy,function(key,value){
        if(!enemyTagList.includes(value.tag)){
            enemyTagList.push(value.tag)
        }
    })
    return enemyTagList
}

function showEnemyData(data,filter=null){//敵データの見出しを表示する関数
    let result=""
    /* 表の見出しを作成する */
    const tableHeaderList={//表の見出しリスト
        name:"名前",
        level:"レベル",
        tag:"タグ"
    }
    let tableHeaderContent=""//<th>を入れる<tr>要素の中身
    for(let i in tableHeaderList){//表の見出しを作成する
        tableHeaderContent+=addHtmlTag("th",tableHeaderList[i])
    }
    result+=addHtmlTag("tr",tableHeaderContent)//作成した<th>要素を<tr></tr>で囲んで出力用変数に代入する
    /* 表の中身を作成する */
    function getEnemyDataByTag(tagName){//指定されたタグに合致する敵データを取得する関数
        let enemyDataTr=""//<td>を入れる<tr>要素の中身
        $.each(data.enemy,function(key,value){
            if(tagName===value.tag){
                const enemyDataTd=addHtmlTag("td",value.name)+addHtmlTag("td",value.level)+addHtmlTag("td",value.tag)
                enemyDataTr+=addHtmlTag("tr",enemyDataTd)//作成した<td>要素を<tr></tr>で囲んで出力する
            }
        })
        return enemyDataTr
    }
    let tableDataContent=""//表の中身
    if(filter===null){//フィルターなしのとき
        let allEnemyTag=getAllEnemyTag(data)
        for(let i in allEnemyTag){//タグ毎にデータをまとめて出力する
            tableDataContent+=getEnemyDataByTag(allEnemyTag[i])
        }
    }else{//フィルターありのとき
        for(let i in filter){//指定されたタグ毎にデータをまとめて出力する
            tableDataContent+=getEnemyDataByTag(filter[i])
        }
    }
    result+=tableDataContent
    tableArea.innerHTML=result//表の中身を変更する
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