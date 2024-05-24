# react-ts-shin-study-record

![main](/docs/images/main.jpg)

---

## サービス説明

ShinStudyRecord は学習内容、学習時間を記録、閲覧できるシンプルな Web アプリケーションです。

## 使用技術

Frontend:

- React 18.20.2
- react-hook-form 7.51.4
- TypeScript 5.4.5
- chakra-ui/react 2.8.2

Backend:

- Supabase

Test：

- Jest 29.7

CI/CD：

- Github Actions

Deploy:

- Firebase Hosting

## インストール方法

```bash
$ git clone https://github.com/nyakako/react-ts-shin-study-record.git
$ cd react-ts-shin-study-record
```

(下記のデプロイ、動作確認等をする場合は Github の自分のアカウントにリポジトリを作って push しておく)

## 環境設定

1. env ファイルをコピー

```bash
$ cp .env.local .env
```

### supabase の設定

2. [Supabase](https://supabase.com/)のアカウントを作成する
3. 新規プロジェクトを作成する(プロジェクト名は study-record、データベースパスワードは自由)
4. Table Editor で以下のテーブルを作成する

テーブル名 : study-record

| column     | type        | option   |
| ---------- | ----------- | -------- |
| id         | uuid        |          |
| title      | varchar     | non null |
| time       | int4        | non null |
| created_at | timestanptz | now()    |

5. 1 でコピーした.env ファイルの
   VITE_SUPABASE_URL に Project URL、
   VITE_SUPABASE_ANON_KEY に Anon key をセット
   （Project Settings>API のページか下記で確認可能）
   https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

### firebase の設定

6. [Firebase](https://firebase.google.com/?hl=ja)のアカウントを作成する
7. Firebase のプロジェクトを作成する(プロジェクト名は任意)
8. ウェブアプリを登録
9. Firebase Cli のインストール(SDK は不要)

```bash
npm install -g firebase-tools
```

10. Google へのログイン

```bash
$ firebase login
```

11. firebase と Github の連携設定等

```bash
$ firebase init hosting

# 途中の質問への回答方法
What do you want to use as your public directory? (public)
→ dist
? Configure as a single-page app (rewrite all urls to /index.html)? (y/N)
→y
? Set up automatic builds and deploys with GitHub? (y/N)
→y
? File dist/index.html already exists. Overwrite? (y/N)
→N（yにするとindex.htmlが上書きされてしまうので必ずN！）
- Githubにログイン
- CI/CDに使うリポジトリを選択（clone後、自アカウントのgithubにpushしたもの）
? Set up the workflow to run a build script before every deploy? (y/N)
→ y
? What script should be run before every deploy? (npm ci && npm run build)
→ そのままエンター
? GitHub workflow file for PR previews exists. Overwrite? firebase-hosting-pull-request.yml (y/N)
→ N(すでに作成済みのため)
? Set up automatic deployment to your site's live channel when a PR is merged? (Y/n)
→ N(すでに作成済みのため)
```

12. アプリをビルドする

```bash
$ npm run build
```

13. デプロイする

```bash
$ firebase deploy
```

### Github Actions の設定

14. (CI/CD を行う場合)
    Github Actios で該当リポジトリの secrets に SUPABASE\*URL、SUPABASE*ANON_KEY を登録します。(こちらは VITE*は不要です)

登録後、main ブランチへの push、merge 時に自動テスト、自動デプロイが走ります。

## 起動方法

```bash
$ npm run dev
```

## Test 方法

```bash
$ npm run test
```
