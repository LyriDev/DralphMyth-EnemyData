const user="user0"
const dataBaseUrl=`https://dralphmyth-enemydata-default-rtdb.firebaseio.com/${user}/data.json`

function dataBase_delete(option=""){//データベースのデータを全て削除する関数
    fetch(dataBaseUrl,{
        method: 'DELETE'
    }).then(res=>{
        //console.log("From delete\n"+res.statusText)
        if(option==="reload"){
            location.reload()//削除し終えたら画面を再読み込みする
        }
    })
}
function dataBase_update(url,data,option="",optionUrl=""){//データベースのデータを更新する関数
    fetch(url,{
        method:'PUT',
        mode:'cors',
        headers:{
        'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res=>{
        //console.log("From update\n"+res.statusText)
        switch(option){
            case "reload":
                location.reload()//更新し終えたら画面を再読み込みする
                break
            case "jump":
                if(optionUrl===undefined){break}//オプションURLが設定されていないなら何もしない
                location.href=optionUrl//オプションURLへ移動
                break
            case "open":
                if(optionUrl===undefined){break}//オプションURLが設定されていないなら何もしない
                window.open(optionUrl,"_blank")//新しいタブでオプションURLを開く
                break
            default:
                break
        }
    })
}

/* 
function abstract_dataBase_get(url){//データベースのデータを取得する関数
    fetch(url).then(response=>response.json()).then(respondedData=>{
        console.log(JSON.stringify(respondedData))
        //ここに実際の処理
    })
}
 */