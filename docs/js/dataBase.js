const loginPage="./login.html"
let userName=""
let dataBaseUrl=`https://dralphmyth-enemydata-default-rtdb.firebaseio.com/users/user0/data.json`

/* ユーザーデータを管理する関数 */
function setUser(userDisplayName,userUid){//ユーザーを設定する関数
    userName=userDisplayName
    dataBaseUrl=`https://dralphmyth-enemydata-default-rtdb.firebaseio.com/users/${userUid}/data.json`
}
function logout(){//ログアウトする関数
    firebase.auth().signOut().then(()=>{
        console.log("ログアウトしました");
    })
    .catch( (error)=>{
        console.log(`ログアウト時にエラーが発生しました (${error})`);
    });
}

/* データベースを管理する関数 */
function dataBase_delete(idToken, option=""){//データベースのデータを全て削除する関数
    fetch(dataBaseUrl,{
        method: 'DELETE',
        headers: {
            "authorization": `Bearer ${idToken}`
        }
    }).then(res=>{
        //console.log("From delete\n"+res.statusText)
        if(option==="reload"){
            location.reload()//削除し終えたら画面を再読み込みする
        }
    })
}
function dataBase_update(url, data, idToken, option="", optionUrl=""){//データベースのデータを更新する関数
    fetch(url,{
        method:'PUT',
        mode:'cors',
        headers:{
            'Content-Type':'application/json',
            "authorization": `Bearer ${idToken}`
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
