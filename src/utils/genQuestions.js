import { getIncorrectQuestions } from "./storageManager";
// {
//     num1: 3,         // 左側の数字 (例: 3)
//     num2: 5,         // 右側の数字 (例: 5)
//     op: '*',         // 内部的な演算子文字 ('+', '-', '*', '/')
//     opSymbol: '×',   // 画面表示用の演算子文字 ('+', '-', '×', '÷')
//     answer: 15,      // 正解の数値 (例: 15)
//     blankType: 'a',  // 空欄の位置 ('a': 答え, 'l': 左側, 'r': 右側※穴埋めモード用)
//     originalOpMode: '*' // 生成元のモード情報
// }
// 1. 通常の整数計算 (例: 3 × 5 = ?)
// {
//     layoutType: "standard",
//     left: "3",
//     opSymbol: "×",
//     right: "5",
//     answerBox: "right", // どこに入力欄を置くか
//     answer: "15"
// }
//
// // 2. 分数の計算 (例: 1/2 + 1/3 = ?)
// {
//     layoutType: "fraction",
//     left: { numerator: "1", denominator: "2" },
//     opSymbol: "+",
//     right: { numerator: "1", denominator: "3" },
//     answerBox: "right-fraction", // 答えも分数なのか、整数なのか
//     answer: { numerator: "5", denominator: "6" }
// }
//
// // 3. 小数の計算 (例: 1.5 + 2.3 = ?)
// {
//     layoutType: "decimal",
//     left: "1.5",
//     opSymbol: "+",
//     right: "2.3",
//     answerBox: "right",
//     answer: "3.8"
// }

export function genQuestions(mode, settings) {
    let questions = [];

    console.log("mode:", mode);
    if (mode === 'normal') {
        questions = genAdaptiveQuestions(settings);
    } else if (mode === 'basic') {
        console.log("settings:", settings);
        const order = settings.order; // 'inorder', 'reverse' or 'random'
        const timesTable = settings.timesTable; // 1 to 9

        for (let i = 1; i <= 9; i++) {
            // i が選択された「段」に含まれている場合
            if (timesTable[i - 1]) {
                for (let j = 1; j <= 9; j++) {
                    questions.push({
                        type: 'standard',
                        num1: i,
                        num2: j,
                        op: '*',
                        opSymbol: '×',
                        ans: i * j, //解答の位置に入る値
                        ans1: i * j, //実際の解答になる値
                        blankType: 'a',
                        originalOpMode: '*'
                    });
                }
            }
        }
        console.log("questions before order:", questions);
        
        if (order === 'reverse') {
            questions.reverse();
        } else if (order === 'random') {
            console.log("Shuffling questions...");
            questions.sort(() => Math.random() - 0.5);
        }
    } else if (mode === 'review') {
        const num = settings.count;
        // ランダムにnum個の問題を選択する
        // numがpoolの長さより大きい場合は、すべての問題を返す

        let pool = getIncorrectQuestions();

        if (num >= questions.length) {
            return pool;
        }

        const selectedQuestions = [];
        const usedIndices = new Set();

        while (selectedQuestions.length < num) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                selectedQuestions.push(questions[randomIndex]);
            }
        }
    }

    return questions;
}

function genAllProblemPool(settings) {
    const pool = [];
    const opMode = settings.op; // '+', '-', '*', '/', 'rand-pm', 'rand-pd', 'rand-all', 'mushikui-pm', 'mushikui-pd', 'mushikui-all'
    const range = settings.range; // 'positive', 'all'
    let ops = [];

    if (opMode === 'rand-pm' || opMode === 'mushikui-pm') ops = ['+', '-'];
    else if (opMode === 'rand-pd' || opMode === 'mushikui-pd') ops = ['*', '/'];
    else if (opMode === 'rand-all' || opMode === 'mushikui-all') ops = ['+', '-', '*', '/'];
    else ops = [opMode];

    const isPositiveOnly = (range === 'positive');
    const min1 = isPositiveOnly ? 0 : -20;
    const max1 = 20;
    const min2 = isPositiveOnly ? 0 : -20;
    const max2 = 20;

    ops.forEach(op => {
        if (op === '+' || op === '-') {
            for (let i = min1; i <= max1; i++) {
                for (let j = min2; j <= max2; j++) {
                    if (op === '-' && isPositiveOnly && i < j) continue; // 正の範囲で引き算の場合、結果が負になる組み合わせは除外
                    pool.push({ num1: i, num2: j, op:op });
                }
            }
        } else if (op === '*') {
            let minMul = isPositiveOnly ? 0 : -10;
            let maxMul = 10;
            for (let i = minMul; i <= maxMul; i++) {
                for (let j = minMul; j <= maxMul; j++) {
                    pool.push({ num1: i, num2: j, op:op });
                }
            }
        } else if (op === '/') {
            let minDiv = isPositiveOnly ? 1 : -10;
            let maxDiv = 10;
            let minAns = isPositiveOnly ? 1 : -10;
            let maxAns = 10;

            for (let div = minDiv; div <= maxDiv; div++) {
                if (div === 0) continue; // 0で割るのは無効
                for (let ans = minAns; ans <= maxAns; ans++) {
                    let num1 = div * ans;
                    pool.push({ num1: num1, num2: div, op:op });
                }
            }
        }
    });

    return pool;
}

function genAdaptiveQuestions(settings) {
    const basePool = genAllProblemPool(settings);
    const isMushikui = settings.op.startsWith('mushikui');
    const targetCount = settings.count;

    let extendedPool = [];
    basePool.forEach(item => {
        const isIncludeZero = (item.num1 === 0 || item.num2 === 0);

        if (isMushikui) {
            const blankType = ['l', 'r', 'a']
            blankType.forEach(type => {
                if (item.op === '/' && type === 'r' && item.num1 === 0) return;
                if (item.op === '*' && type === 'r' && item.num1 === 0) return;
                if (item.op === '*' && type === 'l' && item.num2 === 0) return;

                let w = getProblemWeight(item.num1, item.op, item.num2, type);

                if (isIncludeZero && w === 1) w = 0.5;

                extendedPool.push({
                    num1: item.num1,
                    num2: item.num2,
                    op: item.op,
                    blankType: type,
                    weight: w
                });
            });
        } else {

            let w = getProblemWeight(item.num1, item.op, item.num2, 'a');
            if (isIncludeZero && w === 1) w = 0.5;

            extendedPool.push({
                num1: item.num1,
                num2: item.num2,
                op: item.op,
                blankType: 'a',
                weight: w
            });
        }
    });

    let selectedQuestions = [];
    const loopCount = Math.min(targetCount, extendedPool.length);

    for (let i = 0; i < loopCount; i++) {
        const totalWeight = extendedPool.reduce((sum, item) => sum + item.weight, 0);
        let rand = Math.random() * totalWeight;
        let selectedIndex = -1;

        for (let j = 0; j < extendedPool.length; j++) {
            rand -= extendedPool[j].weight;
            if (rand <= 0) {
                selectedIndex = j;
                break;
            }
        }

        const selectedItem = extendedPool[selectedIndex];
        selectedQuestions.push({
            type: 'standard',
            num1: selectedItem.num1,
            num2: selectedItem.num2,
            op: selectedItem.op,
            opSymbol: getOpSymbol(selectedItem.op),
            ans: calcAnswer(selectedItem.num1, selectedItem.op, selectedItem.num2), // 解答の位置に入る値
            ans1: selectedItem.blankType === 'a' ? calcAnswer(selectedItem.num1, selectedItem.op, selectedItem.num2) : selectedItem.blankType === 'l' ? selectedItem.num1 : selectedItem.num2, // 実際の解答になる値
            blankType: selectedItem.blankType,
            originalOpMode: settings.op
        });

        extendedPool.splice(selectedIndex, 1);
    }

    return selectedQuestions;
}

function calcAnswer(num1, op, num2) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
        default:
            throw new Error(`Unsupported operator: ${op}`);
    }
}

function getOpSymbol(op) {
    switch (op) {
        case '+':
            return '+';
        case '-':
            return '-';
        case '*':
            return '×';
        case '/':
            return '÷';
        default:
            throw new Error(`Unsupported operator: ${op}`);
    }
}

function getProblemWeight(num1, op, num2, blankType) {
    const questionStats = JSON.parse(localStorage.getItem('calc_question_stats')) || {};
    const key = `${num1}_${op}_${num2}`;

    if (!questionStats[key] ||
        !questionStats[key][blankType] ||
        !questionStats[key][blankType].length === 0) {
         if (num1 === 0 || num2 === 0) return 1;

        return 3;
    } 

    const history = questionStats[key][blankType];

    const absoluteWrongCount = history.filter(val => val === -1).length;
    const revengedWrongCount = history.filter(val => val === 0).length;

    if (absoluteWrongCount + revengedWrongCount > 0) {
        return 4 + 15 * absoluteWrongCount + 4 * revengedWrongCount;
    } else {
        // ─── ✨【大修正】すべて一発正解(1)の場合の傾斜制御 ───
        // 履歴の件数（正解の回数）に応じて、ベースライン3から段階的にウエイトを減らす
        // history.length が 1件 ➔ 3 - 0 = ウエイト 3
        // history.length が 2件 ➔ 3 - 1 = ウエイト 2
        // history.length が 3件 ➔ 3 - 2 = ウエイト 1 (完全克服)
        return 3 - (history.length - 1);
    }
}
