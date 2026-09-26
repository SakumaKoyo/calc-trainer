import NormalMode from "../../../modes/NormalMode/NormalMode";
import BasicMode from "../../../modes/BasicMode/BasicMode";
import ReviewMode from "../../../modes/ReviewMode/ReviewMode";
import { getIncorrectQuestions } from "/src/utils/storageManager";

function SetupView({ 
    onStart,
    mode, setMode, 
    normalSettings, setNormalSettings,
    basicSettings, setBasicSettings,
    reviewSettings, setReviewSettings
    }) {

    const numIncorrect = getIncorrectQuestions().length;

    if (numIncorrect === 0 && mode === 'review') {
        setMode('normal');
    }

    return (
        <div id="setup-view" className="card main-card">
            <h2>トレーニング設定</h2>
            
            <div className="mode-toggle-container">
                <button
                    id="mode-basic-btn"
                    className={`mode-toggle-btn ${ mode === "basic" ? "active" : "" }`}
                    onClick={() => setMode("basic")}
                >
                    九九基礎
                </button>

                <button
                    id="mode-normal-btn"
                    className={`mode-toggle-btn ${ mode === "normal" ? "active" : ""}`}
                    onClick={() => setMode("normal")}
                >
                    通常
                </button>

                {numIncorrect > 0 && (
                    <button
                    id="mode-review-btn"
                    className={`mode-toggle-btn ${ mode === "review" ? "active" : "" }`}
                    onClick={() => setMode("review")}
                    >
                    復習（{getIncorrectQuestions().length}）
                    </button>

                )}
            </div>

            {mode === "basic" && <BasicMode settings={basicSettings} setSettings={setBasicSettings}/>}
            {mode === "normal" && <NormalMode settings={normalSettings} setSettings={setNormalSettings}/>}
            {mode === "review" && <ReviewMode settings={reviewSettings} setSettings={setReviewSettings}/>}

            <button id="start-btn" className="primary-btn" onClick={onStart}>スタート</button>
            <footer className="app-footer">
                <p>計算トレーニングアプリ v9</p>
            </footer>
        </div>

    );
}

export default SetupView;
