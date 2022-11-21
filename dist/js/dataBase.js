const isLogin=true
const loginPage=""//TODO ログインページの作成
const newUser={//ユーザーデータの枠組み
    key:null,
    name:null,
    password:null
}
let user="user0"//ユーザー名ではなくディレクトリ名 ユーザーのインデックスを登録する仕様
let dataBaseUrl=`https://dralphmyth-enemydata-default-rtdb.firebaseio.com/${user}/data.json`

/* ユーザーデータを管理する関数 */
function setUser(){//ユーザーを設定する関数
    //TODO ログイン処理
    user=window.prompt("ユーザー名を入力してください", "");
    dataBaseUrl=`https://dralphmyth-enemydata-default-rtdb.firebaseio.com/${user}/data.json`
}


function logout(){//ログアウトする関数
    //TODO ログアウト処理
    alert("ログアウトしました。")
}

/* データベースを管理する関数 */
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