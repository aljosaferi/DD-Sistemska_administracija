
import './Button.scss'

interface ButtonProps {
    type: "primary" | "secondary";
    children?: React.ReactNode;
    disabled?: boolean;
    width?: string | number;
    onClick?: () => void;
}

function Button({
    type,
    children,
    disabled,
    width,
    onClick
}: ButtonProps) {
    return (
        <button 
            className={type} 
            disabled={disabled} 
            onClick={onClick}
            style={{ width: width }}
        >
            {children}
        </button>
    );
}

export default Button;