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
# Windows用パッケージング
% npm run build:win

# Mac用パッケージング
% npm run build:mac

# Linux用パッケージング
% npm run build:linux
```
でパッケージング化できます。

ビルドには`nw-builder`を使用しています。

