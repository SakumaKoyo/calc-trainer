function FormulaArea({ question, ans1 }) {
    if (!question) {
        return <div className="formula-area">読み込み中...</div>;
    }

    // 負の数の場合に括弧をつけるヘルパー
    const formatNum = (num) => (num < 0 ? `(${num})` : num);

    return (
        <div className="formula-area">
            {/* 1. 通常の問題 (例: 3 + 5 = [ ]) */}
            {question.blankType === 'a' && (
                <>
                    <span id="block-left">{formatNum(question.num1)}</span>
                    <span id="block-middle">{question.opSymbol}</span>
                    <span id="block-right">{formatNum(question.num2)}</span>
                    <span className="equals-mark">＝</span>
                    <div className="answer-box" id="answer-input-box">{ans1}</div>
                </>
            )}

            {/* 2. 左側が虫食いの場合 (例: [ ] + 5 = 8) */}
            {question.blankType === 'l' && (
                <>
                    <div className="answer-box" id="answer-input-box">{ans1}</div>
                    <span id="block-middle">{question.opSymbol}</span>
                    <span id="block-right">{formatNum(question.num2)}</span>
                    <span className="equals-mark">＝ {question.ans}</span>
                </>
            )}

            {/* 3. 右側が虫食いの場合 (例: 3 + [ ] = 8) */}
            {question.blankType === 'r' && (
                <>
                    <span id="block-left">{formatNum(question.num1)}</span>
                    <span id="block-middle">{question.opSymbol}</span>
                    <div className="answer-box" id="answer-input-box">{ans1}</div>
                    <span className="equals-mark">＝ {question.ans}</span>
                </>
            )}
        </div>
    );
}

export default FormulaArea;
