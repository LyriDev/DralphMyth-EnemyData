function getLoginForm(){
    const result = {
        email: "",
        password: ""
    }
    result["email"] = document.getElementById("email").value
    result["password"] = document.getElementById("password").value
    return result
}

function signIn(email, password) {
    const auth = firebase.auth()
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            location.href = "./index.html"
        })
        .catch((error) => {
            console.log(error)
            window.alert("ログインに失敗しました。\nパスワードが間違っているか、アカウントが存在しない可能性があります。")
        })
}

function login(){//ボタンに適用する、ログインする処理
    const data = getLoginForm()
    signIn(data["email"],data["password"])
}

function resetPassword(){//パスワードをリセットする関数
    //パスワードリセットのメールを送るために、アカウントのメールアドレスを求める
    const email = window.prompt("パスワードをリセットするためのメールを送ります。\nアカウントのメールアドレスを入力してください。", "");
    if(mailCheck(email)){// 入力内容が正しいメールアドレス場合
        const auth = firebase.auth()
        auth.sendPasswordResetEmail(email) // パスワードリセットのメールを送る
            .then(() => {
                window.alert("パスワードリセットのメールを送りました。");
            })
            .catch((error) => {
                console.log(error)
                window.alert("パスワードリセットのメール送信に失敗しました。")
            })
    }else{// 空の場合やキャンセルした場合は警告ダイアログを表示
        window.alert("正しいメールアドレスを入力してください。");
    }
}

function mailCheck(mail){// メールアドレスをチェックする関数
    const mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
    const mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
    if( mail.match( mail_regex1 ) && mail.match( mail_regex2 ) ) {
        // 全角チェック
        if( mail.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) { return false; }
        // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
        if( !mail.match( /\.[a-z]+$/ ) ) { return false; }
        return true;
    } else {
        return false;
    }
}