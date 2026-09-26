import { useState, useRef } from "react";
import SetupView from "./View/SetupView";
import CountdownView from "./View/CountdownView";
import GameView from "./View/GameView";
import ResultView from "./View/ResultView";
import { genQuestions } from "/src/utils/genQuestions";
import useSound from 'use-sound';
import countdownSound from '/sound/Countdown.mp3';
import Modal from "/src/components/Modal/Modal";

function PlaySection({ 
    setIsPlaying,
    mode, setMode, 
    normalSettings, setNormalSettings,
    basicSettings, setBasicSettings,
    reviewSettings, setReviewSettings
    }) {

    const [result, setResult] = useState({
        totalQuestions: 0, // 全問題数
        correctCount: 0,   // 正解数
        incorrectCount: 0, // 不正解数
        timeMs: 0,         // かかった総時間（ミリ秒）
        incorrectQuestions: [] // 不正解だった問題の配列
    });
    const [gameState, setGameState] = useState('setup') // 'setup', 'countdown', 'game', 'result'
    const [questions, setQuestions] = useState([]);
    const firstMode = useRef(mode);
    const [soundCountdownPlay] = useSound(countdownSound, { volume: 0.5 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ① ゲーム開始ボタン（SetupView）が押されたときの処理
    const handleStartSetup = () => {
        if (mode === 'basic' && !basicSettings.timesTable.some(v => v)) {
            setIsModalOpen(true);
            return;
        }
        let currentSettings = normalSettings;
        if (mode === 'basic') currentSettings = basicSettings;
        if (mode === 'review') currentSettings = reviewSettings;
        firstMode.current = mode;

        // ★ 通常のゲーム開始時は新しく問題を生成してセット
        const generated = genQuestions(mode, currentSettings);
        setQuestions(generated);

        setIsPlaying(true);
        setGameState('countdown');
        soundCountdownPlay();
    };

    // ② リザルト画面で「今すぐ復習する」が押されたときの処理
    const handleStartReview = () => {
        console.log("handleStartReview called");
        console.log(firstMode);
        console.log(!result.incorrectQuestions || result.incorrectQuestions.length === 0);
        if (!result.incorrectQuestions || result.incorrectQuestions.length === 0) return;

        // モードを 'review' に切り替え
        setMode('review');
        
        // ★ 間違えた問題リストをそのまま今回の問題セットにする
        setQuestions(result.incorrectQuestions);

        // カウントダウンを経由してゲームへ
        setIsPlaying(true);
        setGameState('countdown');
        soundCountdownPlay();
        console.log(firstMode);
    };

    return (
        <section id="play-section" className="tab-content active">
            <div className="play-wrapper">
                
                {gameState === 'setup' && (
                    <SetupView 
                        onStart={handleStartSetup}
                        mode={mode} setMode={setMode}
                        
                        normalSettings={normalSettings} setNormalSettings={setNormalSettings}
                        basicSettings={basicSettings} setBasicSettings={setBasicSettings}
                        reviewSettings={reviewSettings} setReviewSettings={setReviewSettings}
                    />
                )}

                {gameState === 'countdown' && (
                    <CountdownView onFinish={() => setGameState('game')}/>
                )}

                {gameState === 'game' && (
                    <GameView 
                        mode={mode}
                        settings={mode === 'normal' ? normalSettings : 
                                    mode === 'basic' ? basicSettings : reviewSettings}
                        setResult={setResult}
                        onFinish={() => {setIsPlaying(false); setGameState('result');}}
                        questions={questions}
                    />
                )}

                {gameState === 'result' && (
                    <ResultView
                        mode={mode}
                        result={result}
                        onBackToSetup={() => {
                            {console.log(firstMode)}
                            setGameState('setup');
                            setMode(firstMode.current); // 最初に選択されたモードに戻す
                            }
                        }
                        onStartReview={handleStartReview} // 追加
                    />
                )}
                
            </div>

            {isModalOpen && (
                <Modal
                    title="確認"
                    message="九九の段を1つ以上選択してください。"
                    onOk={() => {
                        setIsModalOpen(false);
                    }}
                />
            )}
        </section>
    );
}

export default PlaySection;
