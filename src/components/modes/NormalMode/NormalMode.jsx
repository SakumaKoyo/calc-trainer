import InputGroup from '/src/components/InputGroup/InputGroup.jsx';

function NormalMode({ settings, setSettings}) {
    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,     // 古い設定（他の項目）を展開してそのまま維持する
            [key]: value // 変更したいキーの場所だけ新しい値で上書きする
        }));
    };

// <InputGroup label="数値の形式">
//     <dib className="sub-toggle-container">
//         <button type="button" className="sub-toggle-btn active">整数</button>
//         <button type="button" className="sub-toggle-btn">小数</button>
//         <button type="button" className="sub-toggle-btn">分数</button>
//     </dib>
// </InputGroup>
    return (
        <>
            {/*標準モードの設定画面*/} 
            <div id="normal-setup" className="mode-setup">
                <InputGroup label="演算の種類">
                    <select id="op-select"
                        value={settings.op}
                        onChange={(e) => handleChange('op', e.target.value)}
                    >
                        <option value="+">足し算 (+)</option>
                        <option value="-">引き算 (-)</option>
                        <option value="*">掛け算 (×)</option>
                        <option value="/">割り算 (÷)</option>
                        <option value="rand-pm">足し算・引き算</option>
                        <option value="rand-md">掛け算・割り算</option>
                        <option value="rand-all">四則演算すべて</option>
                        <option value="mushikui-pm">虫食い（+・-）</option>
                        <option value="mushikui-pd">虫食い（×・÷）</option>
                        <option value="mushikui-all">虫食い（四則演算すべて）</option>
                    </select>
                </InputGroup>
                <InputGroup label="数値の範囲">
                    <div className="sub-toggle-container">
                        <button type="button" id="range-positive-btn" 
                            className={`sub-toggle-btn ${settings.range === "positive" ? "active" : ""}`}
                            onClick={() => handleChange('range', 'positive')}>正の数のみ</button>
                        <button type="button" id="range-all-btn" 
                            className={`sub-toggle-btn ${settings.range === "all" ? "active" : ""}`}
                            onClick={() => handleChange('range', 'all')}>負の数を含む</button>
                    </div>
                </InputGroup>
                <InputGroup label="出題数">
                    <select id="count-select"
                        value={settings.count}
                        onChange={(e) => handleChange('count', parseInt(e.target.value))}
                    >
                        <option value="10">10問</option>
                        <option value="20">20問</option>
                        <option value="30">30問</option>
                        <option value="50">50問</option>
                    </select>
                </InputGroup>
            </div>
        </>
    );
}

export default NormalMode;

