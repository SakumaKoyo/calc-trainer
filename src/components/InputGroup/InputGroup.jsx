import "./InputGroup.css";

function InputGroup({ label, children , className = '' }) {
    return (
        <div className={`input-group ${className}`}>
            <label className="input-group-label">{label}</label>
            {children}
        </div>

    );
}

export default InputGroup;
