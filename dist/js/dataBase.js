const dataBaseUrl="https://dralphmyth-enemydata-default-rtdb.firebaseio.com/boards.json"

function dataBass_delete(){//データベースのデータを全て削除する関数
    fetch(dataBaseUrl,{
        method: 'DELETE'
    }).then(res=>{
        //console.log(res.statusText)
        getData(dataBaseUrl)
    })
}
async function dataBass_get(url){//データベースのデータを取得する関数
    await fetch(url).then(response=>response.json()).then(respondedData=>{
        console.log(JSON.stringify(respondedData))
        return respondedData
    })
}
function dataBass_update(url,data){//データベースのデータを更新する関数
    fetch(url,{
        method:'POST',
        mode:'cors',
        headers:{
        'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    }).then(res=>{
        console.log("From update\n"+res.statusText)
        //console.log(JSON.stringify(data))
    })
}