// メニューバーの生成
const menu = new nw.Menu({
	type: 'menubar',
});

// ファイルメニューのサブメニュー要素を生成
const fileMenuItemOptions = [{
	// 新規作成
	label: 'New',
	click: () => {
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

		// 初期状態と異なっていれば確認画面を表示する
		const messageBox = document.getElementById('message-box');
		const message = messageBox.getElementsByClassName('message')[0];
		message.innerHTML = '初期状態から変更されています。<br>' +
			'新規作成してよろしいですか？';

		// ボタンを生成
		const buttonBox = messageBox.getElementsByClassName('button-box')[0];
		const buttons = ['OK', 'キャンセル'];
		let buttonHTML = '';
		for (let i=0; i<buttons.length; i++) {
			buttonHTML += '<button class="button" data-index="' + i + '">' + buttons[i] + '</button>\n';
		}

		buttonBox.innerHTML = buttonHTML;

		// 書き換え後に生成したボタンにクリックイベントを設定
		const buttonElements = buttonBox.getElementsByClassName('button');
		for (let i=0; i<buttons.length; i++) {
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
			textarea.focus();

			// 「OK」以外が押されたら何もしない
			if (buttonInfo.messageBox.buttonIndex != 0) {
				// クリックしたボタン状況を初期化
				buttonInfo.messageBox.buttonIndex = -1;
				return;
			}

			// 押されたボタンが「OK」であれば新規作成する
			initializedText = '';
			textarea.value = '';

			// クリックしたボタン状況を初期化
			buttonInfo.messageBox.buttonIndex = -1;
		});
	},
}, {
	// ファイルを開く
	label: 'Open',
	click: () => {
	},
}, {
	// ファイルに保存
	label: 'Save',
	click: () => {
	},
}, {
	// 閉じる
	label: 'Close',
	click: () => {
	},
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
