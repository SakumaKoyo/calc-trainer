import './Tenkey.css'
function Tenkey({
    type,
    onSubmit,
    setAns1,
    setAns2,
    setAns3
}) {
    // const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '負(-)', '0', 'C', '決定'];
    const normalKeys = [
        { id: 'normalKey-1', label: '1', className: 'normal key-btn' },
        { id: 'normalKey-2', label: '2', className: 'normal key-btn' },
        { id: 'normalKey-3', label: '3', className: 'normal key-btn' },
        { id: 'normalKey-4', label: '4', className: 'normal key-btn' },
        { id: 'normalKey-5', label: '5', className: 'normal key-btn' },
        { id: 'normalKey-6', label: '6', className: 'normal key-btn' },
        { id: 'normalKey-7', label: '7', className: 'normal key-btn' },
        { id: 'normalKey-8', label: '8', className: 'normal key-btn' },
        { id: 'normalKey-9', label: '9', className: 'normal key-btn' },
        { id: 'normalKey-minus', label: '負（-）', className: 'normal key-btn action' },
        { id: 'normalKey-0', label: '0', className: 'normal key-btn' },
        { id: 'normalKey-clear', label: 'C', className: 'normal key-btn action' },
        { id: 'normalKey-enter', label: '決定', className: 'normal key-btn enter' }
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
    { id: 'fractionKey-1', label: '1', className: 'fractional key-btn' },
    { id: 'fractionKey-2', label: '2', className: 'fractional key-btn' },
    { id: 'fractionKey-3', label: '3', className: 'fractional key-btn' },
    { id: 'fractionKey-4', label: '4', className: 'fractional key-btn' },
    { id: 'fractionKey-5', label: '5', className: 'fractional key-btn' },
    { id: 'fractionKey-6', label: '6', className: 'fractional key-btn' },
    { id: 'fractionKey-7', label: '7', className: 'fractional key-btn' },
    { id: 'fractionKey-8', label: '8', className: 'fractional key-btn' },
    { id: 'fractionKey-9', label: '9', className: 'fractional key-btn' },
    { id: 'fractionKey-minus', label: '負（-）', className: 'fractional key-btn action' },
    { id: 'fractionKey-0', label: '0', className: 'fractional key-btn' },
    { id: 'fractionKey-clear', label: 'C', className: 'fractional key-btn action' },
    { id: 'fractionKey-enter', label: '決定', className: 'fractional key-btn enter' }
];

    if (type === 'normal') {
        return (
            <div className="fixed-tenkey">
                <div className="tenkey-grid" id="tenkey-grid-element">
                    {normalKeys.map(key => (
                        <button 
                            key={key.id} 
                            className={key.className} 
                            onClick= {
                                key.id === 'normalKey-clear' ? () => setAns1("") :
                                key.id === 'normalKey-minus' ? 
                                    () => setAns1(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev) :
                                    key.id === 'normalKey-enter' ? onSubmit :
                                    () => setAns1(prev => prev.length < 5 ? prev + key.label : prev)}
                        >
                                {key.label}
                        </button>
                    ))}
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
