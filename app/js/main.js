const fs = require('fs-extra');

// オープン時のテキスト状態を保持する変数
let initializedText = null;

// ボタン情報
const buttonInfo = {
	messageBox: {
		buttonIndex: -1,
	},
};

// DOM読み込み後の処理
window.onload = () => {
	// メニューバー生成
	generateMenuBar();

	// テキストエリアのDOMを取得
	const textarea = document.getElementById("memo");
	if (!textarea) {
		console.error('テキストエリアがありません。');
		return;
	}

	// テキスト状態を初期化
	initializedText = '';

	// タブキー押下時の処理を設定
	textarea.addEventListener('keydown', onKeydownTabKey);
	// テキストエリアにフォーカスする
	textarea.focus();

	// ファイルオープン用DOMにイベントリスナを設定
	const openFileElement = document.getElementById('open-file');
	openFileElement.addEventListener('change', openFileCallback);

	// ファイル新規保存用DOMにイベントリスナを設定
	const saveFileAsElement = document.getElementById('save-file-as');
	saveFileAsElement.addEventListener('change', saveFileCallback);
};

// 新規作成
const newFile = () => {
	const textarea = document.getElementById('memo');
	if (!textarea) {
		console.error('テキストエリアがありません。');
		return;
	}

	// テキストエリアが初期状態と同じであれば新規作成する
	if (textarea.value == initializedText) {
		initializedText = '';
		textarea.value = '';
		return;
	}

	// テキストエリアからフォーカスを外す
	textarea.blur();

	// メッセージ用HTML
	const message = '初期状態から変更されています。<br>' +
		'新規作成してよろしいですか？';

	// ボタン用HTML
	const buttons = ['OK', 'キャンセル'];
	let buttonHTML = '';
	for (let i=0; i<buttons.length; i++) {
		buttonHTML += '<button class="button" data-index="' + i + '">' + buttons[i] + '</button>\n';
	}

	const _callback = () => {
		initializedText = '';
		textarea.value = '';
	};

	// 確認画面を表示する
	showMessageBox(message, buttonHTML, _callback);
};

// ファイルから開く
const openFile = () => {
	const textarea = document.getElementById('memo');

	// 初期状態であればファイルから開く
	if (textarea.value == initializedText) {
		const element = document.getElementById('open-file');
		element.click();
		return;
	}

	const message = '初期状態から変更されています。<br>' +
		'現在の変更を破棄しますか？';

	let buttonHTML = '';
	const buttons = ['破棄', 'キャンセル'];
	for (let i=0; i<buttons.length; i++) {
		buttonHTML += '<button class="button" data-index="' + i + '">' + buttons[i] + '</button>\n';
	}

	const _callback = () => {
		const element = document.getElementById('open-file');
		element.click();
	};

	// メッセージ画面にて確認を行う
	showMessageBox(message, buttonHTML, _callback);
};

// ファイルダイアログを閉じたあとの処理
const openFileCallback = evt => {
	// ファイルの中身を取得
	const filePath = evt.target.value;
	const content = fs.readFileSync(filePath, 'utf8');

	// テキストエリアのDOMを取得
	const textarea = document.getElementById('memo');

	// ファイルの中身を反映する
	initializedText = content;
	textarea.value = content;

	// 上書き保存用DOMを更新する
	document.getElementById('save-file-as').nwsaveas = filePath;
};

// 上書き保存
const saveFile = () => {
	// 保存用DOMを取得
	const element = document.getElementById('save-file-as');
	const filePath = element.nwsaveas;

	// ファイル名が指定されていない場合は新規保存する
	if (filePath === undefined || filePath === null || filePath === '') {
		saveFileAs();
		return;
	}

	saveFileCore(filePath);
};

// 名前をつけて保存
const saveFileAs = () => {
	// 保存用DOMを取得
	const element = document.getElementById('save-file-as');
	element.click();
};

const saveFileCallback = evt => {
	saveFileCore(evt.target.value);
};

const saveFileCore = filePath => {
	// テキストエリアのDOMを取得
	const textarea = document.getElementById('memo');
	const content = textarea.value;

	// ファイルに書き込み
	fs.writeFileSync(filePath, content);

	// 初期状態を更新
	initializedText = content;

	// 上書き保存用DOMを更新
	document.getElementById('save-file-as').nwsaveas = filePath;
};

// MemoNWを終了する
const closeMemoNW = () => {
	nw.Window.get().close();
};

// メッセージボックスを表示する
const showMessageBox = (messageHTML, buttonHTML, callback) => {
	// メッセージボックスのDOMを取得
	const messageBox = document.getElementById('message-box');

	// メッセージを設定
	const message = messageBox.getElementsByClassName('message')[0];
	message.innerHTML = messageHTML;

	// ボタンを設定
	const buttonBox = messageBox.getElementsByClassName('button-box')[0];
	buttonBox.innerHTML = buttonHTML;

	// 書き換え後に生成したボタンにクリックイベントを設定
	const buttonElements = buttonBox.getElementsByClassName('button');
	for (let i=0; i<buttonElements.length; i++) {
		buttonElements[i].addEventListener('click', onClickMessageBoxButton);
	}

	// メッセージボックスを表示
	const messageBoxBG = document.getElementById('message-box-bg');
	messageBoxBG.style.display = 'block';

	// 確認画面の応答確認
	const id = setInterval(() => {
		// 確認画面のボタンが押されていなければ待機
		if (buttonInfo.messageBox.buttonIndex < 0) {
			return;
		}

		// 待機状態を解除
		clearInterval(id);

		// メッセージボックスを非表示にし、テキストエリアにフォーカスする
		messageBoxBG.style.display = 'none';
		document.getElementById('memo').focus();

		// 「OK」以外が押されたら何もしない
		if (buttonInfo.messageBox.buttonIndex != 0) {
			// クリックしたボタン状況を初期化
			buttonInfo.messageBox.buttonIndex = -1;
			return;
		}

		// クリックしたボタン状況を初期化
		buttonInfo.messageBox.buttonIndex = -1;

		// コールバック関数を実行
		callback();
	});
};

// メニューバーの生成
const generateMenuBar = () => {
	const menu = new nw.Menu({
		type: 'menubar',
	});

	// ファイルメニューのサブメニュー要素を生成
	const fileMenuItemOptions = [{
		// 新規作成
		label: 'New',
		click: newFile,
	}, {
		// ファイルを開く
		label: 'Open',
		click: openFile,
	}, {
		// 上書き保存
		label: 'Save',
		click: saveFile,
	}, {
		// 名前をつけて保存
		label: 'SaveAs',
		click: saveFileAs,
	}, {
		// 閉じる
		label: 'Close',
		click: closeMemoNW,
	}];

	// 「File」メニューの子要素を生成
	const fileMenuItem = new nw.Menu();
	fileMenuItemOptions.filter(option => {
		fileMenuItem.append(new nw.MenuItem({
			label: option.label,
			click: option.click,
		}));
	});

	// 「File」メニューを追加
	menu.append(new nw.MenuItem({
		label: 'File',
		submenu: fileMenuItem,
	}));

	// ウィンドウにメニューバーを追加
	nw.Window.get().menu = menu;
};

// タブキー押下時の処理
const onKeydownTabKey = evt => {
	// 押下したキーコードを取得
	const keyCode = evt.keyCode;

	// タブキー以外は何もしない
	if (keyCode != 9) {
		return;
	}

	// 配下のイベントを起動しない
	evt.preventDefault();

	// テキストエリアのDOMを取得
	const textarea = document.getElementById("memo");

	// キャレットの位置を取得
	const currentPos = textarea.selectionStart;

	// 内容を取得
	const value = textarea.value;

	// 現在のキャレット位置にタブを挟む
	textarea.value = value.slice(0, currentPos) + '\t' +
		value.slice(currentPos, value.length);

	// キャレット位置を更新
	textarea.selectionStart = currentPos + 1;
	textarea.selectionEnd = currentPos + 1;
};

// メッセージボックスのボタンクリック時の処理
const onClickMessageBoxButton = evt => {
	// メッセージボックスでクリックしたボタンインデックス情報を更新
	buttonInfo.messageBox.buttonIndex = evt.target.dataset.index;
};
