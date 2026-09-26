import './Chip.css'
function Chip({ value, onChange, checked, children}){
    return (
        <>
            <label className = "chip-label">
                <input type="checkbox" value={value} onChange={onChange} checked={checked}/>
                <span className="chip-text">
                    {children}
                </span>
            </label>
        </>
    );
}

export default Chip;
