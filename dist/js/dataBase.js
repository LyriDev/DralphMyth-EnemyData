const user="user0"
const dataBaseUrl=`https://dralphmyth-enemydata-default-rtdb.firebaseio.com/${user}/data.json`

function dataBass_delete(reloadOption=false){//データベースのデータを全て削除する関数
    fetch(dataBaseUrl,{
        method: 'DELETE'
    }).then(res=>{
        console.log("From delete\n"+res.statusText)
        if(reloadOption===true){
            location.reload()//削除し終えたら画面を再読み込みする
        }
    })
}
function dataBass_update(url,data,reloadOption=false){//データベースのデータを更新する関数
    fetch(url,{
        method:'PUT',
        mode:'cors',
        headers:{
        'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res=>{
        console.log("From update\n"+res.statusText)
        if(reloadOption===true){
            location.reload()//更新し終えたら画面を再読み込みする
        }
    })
}

/* 
function abstract_dataBass_get(url){//データベースのデータを取得する関数
    fetch(url).then(response=>response.json()).then(respondedData=>{
        console.log(JSON.stringify(respondedData))
        //ここに実際の処理
    })
}
 */