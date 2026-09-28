import { useState } from 'react';
import './Tenkey.css'
function Tenkey({
    type,
    onSubmit,
    setAns1,
    setAns2,
    setAns3
}) {

    const [hasNumber, setHasNumber] = useState(false); // 数字が入力されているかどうかの状態
    // const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '負(-)', '0', 'C', '決定'];
    const normalKeys = [
        { id: 'key-1', label: '1', className: 'normal key-btn' },
        { id: 'key-2', label: '2', className: 'normal key-btn' },
        { id: 'key-3', label: '3', className: 'normal key-btn' },
        { id: 'key-4', label: '4', className: 'normal key-btn' },
        { id: 'key-5', label: '5', className: 'normal key-btn' },
        { id: 'key-6', label: '6', className: 'normal key-btn' },
        { id: 'key-7', label: '7', className: 'normal key-btn' },
        { id: 'key-8', label: '8', className: 'normal key-btn' },
        { id: 'key-9', label: '9', className: 'normal key-btn' },
        { id: 'key-minus', label: '負（-）', className: 'normal key-btn action' },
        { id: 'key-0', label: '0', className: 'normal key-btn' },
        { id: 'key-clear', label: 'C', className: 'normal key-btn action' },
        { id: 'key-enter', label: '決定', className: 'normal key-btn enter' }
    ]
    const decimalKeys = [
        { id: 'key-1', label: '1', className: 'decimal key-btn' },
        { id: 'key-2', label: '2', className: 'decimal key-btn' },
        { id: 'key-3', label: '3', className: 'decimal key-btn' },
        { id: 'key-4', label: '4', className: 'decimal key-btn' },
        { id: 'key-5', label: '5', className: 'decimal key-btn' },
        { id: 'key-6', label: '6', className: 'decimal key-btn' },
        { id: 'key-7', label: '7', className: 'decimal key-btn' },
        { id: 'key-8', label: '8', className: 'decimal key-btn' },
        { id: 'key-9', label: '9', className: 'decimal key-btn' },
        { id: 'key-minus', label: '負（-）', className: 'decimal key-btn action' },
        { id: 'key-point', label: '小数点', className: 'decimal key-btn action' },
        { id: 'key-0', label: '0', className: 'decimal key-btn' },
        { id: 'key-clear', label: 'C', className: 'decimal key-btn action' },
        { id: 'key-enter', label: '決定', className: 'decimal key-btn enter' }
    ]
    const choiceKeys = [
        { id: 'choiceKey-A', label: 'A', className: 'choice-btn' },
        { id: 'choiceKey-B', label: 'B', className: 'choice-btn' },
        { id: 'choiceKey-C', label: 'C', className: 'choice-btn' },
        { id: 'choiceKey-D', label: 'D', className: 'choice-btn' }
    ];
    const fractionKeys = [
    {
        id: 'fractionKey-switch',
        label: '分子／分母',
        className: 'fractional key-btn action switch'
    },
    { id: 'key-1', label: '1', className: 'fractional key-btn' },
    { id: 'key-2', label: '2', className: 'fractional key-btn' },
    { id: 'key-3', label: '3', className: 'fractional key-btn' },
    { id: 'key-4', label: '4', className: 'fractional key-btn' },
    { id: 'key-5', label: '5', className: 'fractional key-btn' },
    { id: 'key-6', label: '6', className: 'fractional key-btn' },
    { id: 'key-7', label: '7', className: 'fractional key-btn' },
    { id: 'key-8', label: '8', className: 'fractional key-btn' },
    { id: 'key-9', label: '9', className: 'fractional key-btn' },
    { id: 'key-minus', label: '負（-）', className: 'fractional key-btn action' },
    { id: 'key-0', label: '0', className: 'fractional key-btn' },
    { id: 'key-clear', label: 'C', className: 'fractional key-btn action' },
    { id: 'key-enter', label: '決定', className: 'fractional key-btn enter' }
];

    function handleKeyPress(keyId, keyLabel) {
        if (keyId === 'key-clear') {
            setAns1("");
            setHasNumber(false);
        } else if (keyId === 'key-minus') {
            setAns1(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
        } else if (keyId === 'key-point') {
            setAns1(prev => prev.includes('.') ? prev : prev + '.');
        } else if (keyId === 'key-enter') {
            setHasNumber(false);
            onSubmit();
        } else {
            setHasNumber(true);
            setAns1(prev => prev.length < 5 ? prev + keyLabel : prev);
        }
    }

    if (type === 'standard') {
        return (
            <div className="fixed-tenkey">
                <div className="tenkey-grid" id="tenkey-grid-element">
                    {normalKeys.map(key => (
                        <button 
                            key={key.id} 
                            className={key.className} 
                            onClick= {() => handleKeyPress(key.id, key.label)}>
                                {key.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    } else if (type === 'decimal') {
        return (
            <div className="fixed-tenkey">
                <div className="tenkey-grid" id="decimal-grid-element">
                    {decimalKeys.map(key => {
                        // hasNumberに応じて表示するキーを切り替える
                        if (key.id === 'key-minus' && hasNumber) {
                            return null;
                        }

                        if (key.id === 'key-point' && !hasNumber) {
                            return null;
                        }

                        return (
                            <button
                            key={key.id}
                            className={key.className}
                            onClick={() => handleKeyPress(key.id, key.label)}
                            >
                            {key.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    } else if (type === 'choice') {
        return (
            <div className="fixed-tenkey">
                <div className="choice-grid" id="choice-grid-element">
                    {choiceKeys.map(key => (
                        <button 
                            key={key.id} 
                            className={key.className} 
                            onClick={() => onSubmit(key.label)}
                        >
                                {key.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    } else if (type === 'fractional') {
        return (
            <div className="fixed-tenkey">
                <div className="tenkey-grid" id="fractional-grid-element">
                    {fractionKeys.map(key => (
                        <button 
                            key={key.id} 
                            className={key.className} 
                            onClick= {
                                key.id === 'fractionKey-clear' ? () => setAns1("") :
                                key.id === 'fractionKey-minus' ? 
                                    () => setAns1(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev) :
                                    key.id === 'fractionKey-enter' ? onSubmit :
                                    () => setAns1(prev => prev + key.label)}
                        >
                                {key.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}

export default Tenkey;
