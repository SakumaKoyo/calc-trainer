function ResultView({mode, result, onBackToSetup, onStartReview}) {
    console.log(result);
    if (result.correctCount === result.totalQuestions) {
        confetti({
            particleCount: 100, // 粒の数
            spread: 70,         // 広がり方
            origin: { y: 0.6 }  // 発生位置（画面下めの中央）
        });
    }
    return (
        
        <div id="result-view" className="card main-card">
            <h2 id="result-title">結果発表 🎉</h2>
            <div className="result-stats">
            {mode === 'basic' && (
                <div id="basic-stats-box">
                    <p>問題数: <strong id="res-basic-count">{result.totalQuestions}問</strong></p>
                    <p>誤答数: <strong id="res-basic-wrong">{result.incorrectCount}回</strong></p>
                    <p>正答率: <strong id="res-correct-rate">
                        {Math.round(result.correctCount/result.totalQuestions*100*100)/100}%
                    </strong></p>
                </div>
            )}
            {mode === 'normal' && (
                <div id="normal-stats-box">
                    <p>総経過時間: <strong id="res-total-time">
                        {Math.floor(result.timeMs / 1000 / 60)}分
                        {String(Math.floor(result.timeMs / 1000) % 60).padStart(2, "0")}秒
                    </strong></p>
                    <p>誤答数: <strong id="res-wrong-count">{result.incorrectCount}回</strong></p>
                    <p>1問あたりの平均速度: <strong id="res-avg-speed">{Math.floor(result.timeMs/result.totalQuestions / 10) /100}秒</strong></p>
                </div>
            )}
            {mode === 'review' && (
                <div id="review-stats-box">
                    <p>問題数: <strong id="res-basic-count">{result.totalQuestions}問</strong></p>
                    <p>復習完了: <strong id="res-review-count">{result.correctCount}問</strong></p>
                    <p>間違えた回数: <strong id="res-review-wrong">{result.incorrectCount}回</strong></p>
                    <p className="review-success-msg">苦手をひとつ克服しました！</p>
                </div>
            )}
            </div>
            {result.incorrectCount > 0 && (
            <button id="instant-review-btn" className="review-btn" onClick={onStartReview}>間違えた問題（{result.incorrectCount}問）を復習する</button>
            )}

            <button id="back-setup-btn" className="primary-btn" onClick={onBackToSetup}>トップに戻る</button>
        </div>

    );
}

export default ResultView;
