window.onload = () => {
	const textarea = document.getElementById("memo");
	if (!textarea) {
		console.error('テキストエリアがありません。');
		return;
	}

	textarea.addEventListener('keydown', onKeydownTabKey);
	textarea.focus();
};

const onKeydownTabKey = evt => {
	const keyCode = evt.keyCode;

	if (keyCode != 9) {
		return;
	}

	evt.preventDefault();

	const textarea = document.getElementById("memo");
	const currentPos = textarea.selectionStart;
	const value = textarea.value;

	textarea.value = value.slice(0, currentPos) + '\t' +
		value.slice(currentPos, value.length);

	textarea.selectionStart = currentPos + 1;
	textarea.selectionEnd = currentPos + 1;
};
