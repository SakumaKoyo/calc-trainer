import InputGroup from "/src/components/InputGroup/InputGroup.jsx";

function ReviewMode({ settings, setSettings}) {
    return (
        <>
            {/*復習モードの設定画面*/}
            <div id="review-setup" className="mode-setup">
                <div id="review-empty-alert" className="hidden-message hidden"></div>
                <InputGroup label="出題数">
                    <select id="review-count-select"
                        value={settings.count}
                        onChange={(e) => setSettings(prev => ({...prev, count: parseInt(e.target.value)}))}
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

export default ReviewMode;
