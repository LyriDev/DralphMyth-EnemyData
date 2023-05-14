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

async function signUp(email, password){
    try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        await sendEmailVerification(userCredential.user)
        window.alert("メールアドレスに登録確認メールを送信しました。")
        location.href = "./index.html"
    } catch (e) {
        if (e instanceof FirebaseError) {
            console.log(e)
            window.alert("ユーザー登録に失敗しました。\n既にメールアドレスが使用されている可能性があります。")
        }
    }
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