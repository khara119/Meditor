# MemoNW

シンプルなメモ帳アプリ

## 概要

Windowsのメモ帳のように手軽に使用できるメモ帳アプリです。

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
# ※Linuxコマンドが使える環境で行ってください。
% npm run build:win

# Mac用パッケージング
% npm run build:mac

# Linux用パッケージング
% npm run build:linux
```
でパッケージング化できます。

ビルドには`nw-builder`を使用しています。

