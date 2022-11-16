# ドラルフ神話 戦闘データエディタ
## 実行方法
**DralphMyth-EnemyData/dist/index.html**をブラウザで開けばよい。  
## 注意
このhtmlファイルはデータ(DralphMyth-EnemyData/dist/data.json)を読み込む必要がある。  
しかしGoogle Chromeを使用する場合、デフォルトではWindows版chromeでローカルファイルに直接アクセスできない。  
そのため、以下の方法でchromeのショートカットを作成して、開く。  
### ショートカットファイルの作成
1. Google Chromeを開き、URL欄に「chrome://version」と入力し、軌道状態を確認する。
1. 「実行ファイルのパス」欄を確認する。  
基本は「C:\Program Files\Google\Chrome\Application\chrome.exe」などと記述されている。
1. 「Windows+E」でエクスプローラーを開く。
1. chromeのショートカットを作成する場所(ディレクトリ)を選択して開いておく。
1. 「Shift+F10」で右クリックメニューを開く。
1. 「Ctrl+X」で新規作成>「Ctrl+S」でショートカットを作成する。
1. 「項目の場所を入力してください」と書かれている場所に対して、以下のように記入する。  
    1. 【2】で確認したchromeの実行ファイルのパスを「"」(ダブルクオート)で囲い、
    1. 半角スペースを1つ空け、
    1. 実行ファイルのパスの後ろに「**--allow-file-access-from-files**」とオプションを追加する。  
    1. 例:**「"C:\Program Files\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files」**
1. これでchromeのショートカットファイルの作成は完了。
### htmlファイルの開き方  
作成したショートカットファイルを実行し、開いたchromeのタブで以下を行う。
1. エクスプローラーから、**DralphMyth-EnemyData/dist/index.html**というファイルを確認する。
1. 開いているchromeのタブに、【1】で確認したファイルを、ドラッグ&ドロップする。