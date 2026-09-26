import InputGroup from '/src/components/InputGroup/InputGroup.jsx';
import Chip from '/src/components/Chip/Chip.jsx';
import './BasicMode.css';

function BasicMode({ settings, setSettings}) {
    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,     // 古い設定（他の項目）を展開してそのまま維持する
            [key]: value // 変更したいキーの場所だけ新しい値で上書きする
        }));
    };

    return (
        <>
            {/* 基本モードの設定画面 */}
            <div id="basic-setup" className="mode-setup">
                <div id="basic-empty-alert" className="hidden-message">⚠️ 記録には残りません。落ち着いて正確に！🔥</div>
                <InputGroup label="出題する段">
                    <div id="chip-container" className="chip-container">
                        {/* チップボタンはjavascriptで生成されます*/}
                        {
                            Array.from({ length: 9 }, (_, i) => i + 1).map(i => (
                                <Chip key={i} value={i} checked={settings.timesTable[i - 1]} onChange={() => {
                                    // 1. 今の配列をコピーした新しい配列を作る
                                    const newTable = [...settings.timesTable];
                                    // 2. コピーした配列の該当部分を反転させる
                                    newTable[i - 1] = !newTable[i - 1];
                                    console.log(newTable);
                                    // 3. まとめて handleChange に渡す
                                    handleChange('timesTable', newTable);
                                }}>{i}の段</Chip>
                            ))
                        }
                    </div>
                </InputGroup>
                <InputGroup label="出題方法">
                    <div className="sub-toggle-container">
                        <button type="button" id="basic-inorder-btn"
                            className={`sub-toggle-btn ${settings.order === "inorder" ? "active" : ""}`}
                            onClick={ () => handleChange('order', 'inorder')}>順番</button>
                        <button type="button" id="basic-reverse-btn"
                            className={`sub-toggle-btn ${settings.order === "reverse" ? "active" : ""}`}
                            onClick={ () => handleChange('order', 'reverse')}>逆順</button>
                        <button type="button" id="basic-random-btn"
                            className={`sub-toggle-btn ${settings.order === "random" ? "active" : ""}`}
                            onClick={ () => handleChange('order', 'random')}>ランダム</button>
                    </div>
                </InputGroup>
            </div>
        </>
    );
}

export default BasicMode;
