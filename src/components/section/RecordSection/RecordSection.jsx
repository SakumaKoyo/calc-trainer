import { useState, useEffect, useRef } from "react";
import InputGroup from "../../InputGroup/InputGroup";
import Chart from "chart.js/auto";

function RecordSection({ normalSettings = { op: '+', range: 'positive' } }) {
    const [filterOp, setFilterOp] = useState(normalSettings.op);
    const [filterRange, setFilterRange] = useState(normalSettings.range);
    const [filterCount, setFilterCount] = useState(20);
    
    const [records, setRecords] = useState([]);
    
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const loadRecords = () => {
        let allRecords = JSON.parse(localStorage.getItem('calc_training_records')) || [];
        allRecords.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        
        let filtered = allRecords.filter(r => r.opMode === filterOp && r.rangeMode === filterRange);

        if (filterCount !== 'all') {
            const numLimit = parseInt(filterCount);
            filtered = filtered.slice(-numLimit);
        }
        
        setRecords(filtered);
        console.log("All records:", allRecords);
        console.log("Loaded records:", filtered);
    };

    useEffect(() => {
        loadRecords();
    }, [filterOp, filterRange, filterCount]);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        if (records.length === 0) {
            ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
            return;
        }

        const labels = records.map(r => r.date);
        const speedData = records.map(r => r.avgSpeed);
        const wrongRateData = records.map(r => parseFloat(((r.wrongCount / r.totalQuestions) * 100).toFixed(1)));

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '誤答率 (%)',
                        data: wrongRateData,
                        backgroundColor: 'rgba(224, 109, 109, 0.3)',
                        borderColor: 'rgba(224, 109, 109, 1)',
                        borderWidth: 1,
                        yAxisID: 'y-wrong',
                        order: 2
                    },
                    {
                        label: '速度 (秒/問)',
                        data: speedData,
                        type: 'line',
                        borderColor: '#4a90e2',
                        backgroundColor: '#4a90e2',
                        borderWidth: 3,
                        pointRadius: 4,
                        fill: false,
                        yAxisID: 'y-speed',
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    'y-speed': { type: 'linear', position: 'left', title: { display: true, text: '秒/問', font: { size: 10 } }, min: 0 },
                    'y-wrong': { type: 'linear', position: 'right', title: { display: true, text: '誤答率(%)', font: { size: 10 } }, min: 0, max: 100, grid: { drawOnChartArea: false } },
                    x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 9 } } }
                },
                plugins: { legend: { labels: { boxWidth: 10, font: { size: 10 } } } }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [records]);

    function removeAllRecords() {
        if (window.confirm("本当に全ての記録を削除しますか？\nこの操作は元に戻せません。")) {
            localStorage.removeItem("calc_training_records");
            localStorage.removeItem("calc_question_stats");
            localStorage.removeItem("calc_incorrect_questions");
            alert("全ての記録を削除しました。");
            loadRecords();
        }
    }

    const getOpDisplay = (opMode) => {
        if (opMode === 'rand-pm') return '±ランダム';
        if (opMode === 'rand-md') return '×÷ランダム';
        if (opMode === 'rand-all') return '四則ランダム';
        if (opMode === 'mushikui-pm') return '虫食い(±)';
        if (opMode === 'mushikui-pd') return '虫食い(×÷)';
        if (opMode === 'mushikui-all') return '虫食い(四則)';
        return opMode;
    };

    const latestRecords = [...records].reverse();

    return (
        <section id="record-section" className="tab-content">
            <div className="card scrollable-card">
                <h2>過去のデータとグラフ</h2>
                
                <div className="filter-panel">
                    <InputGroup label="演算">
                        <select 
                            value={filterOp}
                            onChange={(e) => setFilterOp(e.target.value)}
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
                            <option value="mushikui-all">虫食い（四則すべて）</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="範囲">
                        <select 
                            value={filterRange}
                            onChange={(e) => setFilterRange(e.target.value)}
                        >
                            <option value="positive">正の数のみ</option>
                            <option value="all">負の数を含む</option>
                        </select>
                    </InputGroup>
                </div>

                <InputGroup label="表示件数" className="row-group">
                    <select 
                        value={filterCount}
                        onChange={(e) => setFilterCount(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    >
                        <option value="10">最新10件</option>
                        <option value="20">最新20件</option>
                        <option value="30">最新30件</option>
                        <option value="all">全件</option>
                    </select>
                    <button id="clear-data-btn" className="danger-btn" onClick={removeAllRecords}>データを全消去</button>
                </InputGroup>

                <div className="chart-container" style={{ position: 'relative', width: '100%', height: '250px' }}>
                    <canvas ref={chartRef}></canvas>
                </div>

                <h3>履歴（最新順）</h3>
                <div className="history-list-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>日時</th>
                                <th>演算</th>
                                <th>範囲</th>
                                <th>問題数</th>
                                <th>誤答</th>
                                <th>1問平均</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        該当する記録がありません
                                    </td>
                                </tr>
                            ) : (
                                latestRecords.map((r, index) => (
                                    <tr key={index}>
                                        <td>{r.date}</td>
                                        <td><span className="badge-op">{getOpDisplay(r.opMode)}</span></td>
                                        <td><span className="badge-range">{r.rangeMode === 'positive' ? '正のみ' : '正負'}</span></td>
                                        <td>{r.totalQuestions}問</td>
                                        <td>{r.wrongCount}回</td>
                                        <td><strong>{r.avgSpeed}秒</strong></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default RecordSection;
