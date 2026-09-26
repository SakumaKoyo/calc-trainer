//間違えた問題を記録する
//問題の正解不正解を記録する
//過去に解いた速度や正答率を記録する
//このファイルは、ローカルストレージにデータを保存するための関数を提供します。
//3つの保存などを行う．
//

export function updateQuestionStats(key, blankType, resultValue, isOverwrite = false){
    // 過去の問題の正解不正解を記録する
    // 過去3回分の結果を保存する
    let questionStats = JSON.parse(localStorage.getItem('calc_question_stats')) || {};
    if (!questionStats[key]) {
        questionStats[key] = { a:[], l:[], r:[] };
    }
    if (!questionStats[key][blankType]) {
        questionStats[key][blankType] = [];
    }

    if (isOverwrite && questionStats[key][blankType].length > 0){
        questionStats[key][blankType][questionStats[key][blankType].length - 1] = resultValue;
    } else {
        questionStats[key][blankType].push(resultValue);
        if (questionStats[key][blankType].length > 3) {
            questionStats[key][blankType].shift();
        }
    }

    localStorage.setItem('calc_question_stats', JSON.stringify(questionStats));
}

function getProblemId(problem) {
    return JSON.stringify(problem);
}

export function saveIncorrectQuestion(problem) {
    let pool = JSON.parse(localStorage.getItem('calc_incorrect_questions')) || {};

    const probID = getProblemId(problem);
    const isAlreadySaved = (pool[probID] !== undefined);

    if (!isAlreadySaved) {
        pool[probID] = problem;
        localStorage.setItem('calc_incorrect_questions', JSON.stringify(pool));
    }
}

export function removeIncorrectQuestion(problem) {
    let pool = JSON.parse(localStorage.getItem('calc_incorrect_questions')) || {};

    const probID = getProblemId(problem);

    if (pool[probID] !== undefined) {
        delete pool[probID];
        localStorage.setItem('calc_incorrect_questions', JSON.stringify(pool));
    }
}

export function getIncorrectQuestions() {
    let pool = JSON.parse(localStorage.getItem('calc_incorrect_questions')) || {};
    const questions = Object.values(pool);

    return questions;
}
