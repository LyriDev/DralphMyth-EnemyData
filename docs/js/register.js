function getRegisterForm(){
    const result = {
        email: "",
        password: "",
        "password-check": ""
    }
    result["email"] = document.getElementById("email").value
    result["password"] = document.getElementById("password").value
    result["password-check"] = document.getElementById("password-check").value
    return result
}

function signUp(email, password) {
    const auth = firebase.auth()
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.sendEmailVerification()
            location.href = "./index.html"
        })
        .catch((error) => {
            console.log(error)
            window.alert("ユーザー登録に失敗しました。\n既にメールアドレスが使用されている可能性があります。")
        })
}

function register(){//ボタンに適用する、アカウント登録する処理
    const data = getRegisterForm()
    if(data["password"] === data["password-check"]){
        if(data["password"].length >= 6){
            signUp(data["email"],data["password"])
        }else{
            window.alert("パスワードは6文字以上必要です。")
        }
    }else{
        window.alert("パスワードが間違っています。")
    }
}