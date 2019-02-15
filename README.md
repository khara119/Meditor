# MemoNW

シンプルなメモ帳アプリ

## 概要

Windowsのメモ帳のように手軽に起動でき、
自分好みに設定できるメモ帳アプリです。

NW.jsを使用して作成しているので、build設定を変えれば
Mac, Linux用にも生成できます。

*** 使い方：***

1. 必要パッケージのインストール
```
% npm install
```
で必要なパッケージのインストールを行います。

1. 実行
```
% npm start
```
で実行できます。

1. パッケージング
```
% npm run build
```
でパッケージング化できます。
デフォルトではWindows用のオプションしか追加していないので、
お使いの環境に合わせて`package.json`ファイルの`build`スクリプトを
修正してから上記コマンドを実行してください。
ビルドには`nw-builder`を使用しています。

