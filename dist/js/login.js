/* ログイン処理 */
const uiConfig={
    // ログイン完了時のリダイレクト先
    signInSuccessUrl: './index.html',
    // 利用する認証機能
    signInOptions: [
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
    ]
}
const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged((user)=>{//認証処理終了後の処理
    if(user){
        location.href="index.html"//一覧ページにリダイレクトする
    }else{//非ログイン時の処理
    }
})