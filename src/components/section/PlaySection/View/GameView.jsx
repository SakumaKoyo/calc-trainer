import { useState, useRef, useEffect } from 'react';
import Tenkey from '../../../Tenkey/Teykey';
import FormulaArea from '/src/components/FormulaArea/FormulaArea';
import { saveIncorrectQuestion, removeIncorrectQuestion, updateQuestionStats } from '/src/utils/storageManager';
import useSound from 'use-sound';
import correctSound from '/sound/Correct_Fast-Single.mp3';
import incorrectSound from '/sound/Incorrect.mp3';

function GameView({mode, settings, setResult, onFinish, questions}) {

    const [time, setTime] = useState(0);
    const startTime = useRef(Date.now());
    const [ans1, setAns1] = useState("");
    const [ans2, setAns2] = useState("");
    const [ans3, setAns3] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [incorrectQuestions, setIncorrectQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(1);
    const score = useRef({
        totalQuestions: questions.length,
        correctCount: 0,
        incorrectCount: 0
    });
    const [feedback, setFeedBack] = useState(null);
    const [flashType, setFlashType] = useState(null);
    const FLASH_DURATION = 350; // フィードバック表示時間（ミリ秒）
    const [soundCorrectPlay] = useSound(correctSound, { volume: 0.3 });
    const [soundIncorrectPlay] = useSound(incorrectSound, { volume: 0.3 });
    const isChecking = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Date.now() - startTime.current);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    function checkAnswer() {
        const currentQuestion = questions[currentIdx - 1];
        const statsKey = `${currentQuestion.num1}_${currentQuestion.op}_${currentQuestion.num2}`;
        let bKey = currentQuestion.blankType || 'a';
        const isAns1Valid = !currentQuestion.ans1 || String(currentQuestion.ans1) === String(ans1);
        const isAns2Valid = !currentQuestion.ans2 || String(currentQuestion.ans2) === String(ans2);
        const isAns3Valid = !currentQuestion.ans3 || String(currentQuestion.ans3) === String(ans3);

        const isCorrect = isAns1Valid && isAns2Valid && isAns3Valid;

        if (!ans1 && !ans2 && !ans3) {
            console.log("答えが入力されていません");
            return;
        }

        if (isChecking.current) return; // すでにチェック中なら何もしない
        isChecking.current = true; // チェック中フラグを立てる

        if (!isCorrect) {
            console.log("不正解！");
            soundIncorrectPlay();
            triggerFeedback('✕');
            if (!isAnswered) {
                //問題に対して一回目の解答のときのみカウント，記録をする．
                updateQuestionStats(statsKey, bKey, -1, false);
                saveIncorrectQuestion(currentQuestion);
                score.current.incorrectCount += 1;
                setIncorrectQuestions(prev => [...prev, currentQuestion]);
            }
            setAns1("");
            setAns2("");
            setAns3("");
            setIsAnswered(true);
            isChecking.current = false; // チェック中フラグを下ろす
            return;
        }else {
            console.log("正解！");
            soundCorrectPlay();
            triggerFeedback('◯');
            if (!isAnswered) {
                //問題に対して一回目の解答のときのみカウント，記録をする．
                updateQuestionStats(statsKey, bKey, 1, false);
                removeIncorrectQuestion(currentQuestion);
                score.current.correctCount += 1;
            } else {
                //2回目以降の解答のときは，正解でも不正解でもカウントしない
                updateQuestionStats(statsKey, bKey, 0, true); 
            }
            setIsAnswered(false);
        }

        setTimeout(() => {
        // 次の問題に進む
        if (currentIdx < questions.length) {
            setCurrentIdx(prevIdx => prevIdx + 1);
            setAns1("");
            setAns2("");
            setAns3("");
        } else {
            const timeMs = Date.now() - startTime.current;
            console.log("ゲーム終了");
            // ゲーム終了時の処理
            setResult({
                totalQuestions: score.current.totalQuestions,
                correctCount: score.current.correctCount,
                incorrectCount: score.current.incorrectCount,
                timeMs: timeMs,
                incorrectQuestions: incorrectQuestions
            });

            if (mode === 'normal') {
                // 記録をローカルストレージに保存
                const timestamp = new Date().toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
                const avgSpeed = parseFloat((timeMs/ 1000 / questions.length).toFixed(2));
                const newRecord = {
                    date: timestamp,
                    opMode: settings.op,
                    rangeMode: settings.range,
                    totalQuestions: questions.length,
                    wrongCount: score.current.incorrectCount,
                    avgSpeed: avgSpeed,
                    rawTimestamp: Date.now()
                };

                let currentRecords = JSON.parse(localStorage.getItem('calc_training_records')) || [];
                currentRecords.push(newRecord);
                localStorage.setItem('calc_training_records', JSON.stringify(currentRecords));
            }
            onFinish();
        }
            isChecking.current = false; // チェック中フラグを下ろす
        }, FLASH_DURATION);
    }

    function triggerFeedback(symbol) {
        setFeedBack(symbol);
        setFlashType(symbol === '◯' ? 'correct-flash' : 'incorrect-flash');

        setTimeout(() => {
            setFeedBack(null);
            setFlashType(null);
        }, FLASH_DURATION);
    }

    return (
        <div id="game-view">
            <div className={`formula-card ${flashType || ''}`} id="formula-card-element">

                {/* ゲーム画面のヘッダー部分 */}
                <div className="game-header">
                    <span id="progress-display">第 {currentIdx} / {questions.length} 問</span>
                    <span id="timer-display">
                        {mode === 'normal' && (
                        <div>
                            {Math.floor(time / 1000 / 60)}:
                            {String(Math.floor(time / 1000) % 60).padStart(2, "0")}
                        </div>
                        )}{mode === 'basic' && (
                        <div>
                            基礎モード
                        </div>
                        )}{mode === 'review' && (
                        <div>
                            復習モード
                        </div>
                        )}
                    </span>
                </div>
                
                {/* ゲーム画面の数式部分 */}
                <FormulaArea 
                    question={questions[currentIdx - 1]}
                    ans1={ans1}
                    ans2={ans2}
                    ans3={ans3}
                />

                {/* ★ feedback があるとき（◯や✕のとき）だけ表示 */}
                {feedback && (
                    <div id="feedback-text">
                        {feedback}
                    </div>
                )}
            </div>

            <Tenkey 
                // type={questions[currentIdx - 1].type}
                type="standard"
                onSubmit={() => {
                    checkAnswer();
                }}
                setAns1={setAns1}
            />
        </div>
    );
}

export default GameView;
