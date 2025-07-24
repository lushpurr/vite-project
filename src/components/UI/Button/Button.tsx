import React from "react";

type ButtonProps =  {
    label: string,
    onClick: () => void;
    variant?: 'primary' | 'primary-destructive';
    disabled? :boolean;
} 

const CustomButton: React.FC<ButtonProps> = ({label, onClick, variant = 'primary', disabled = false}) => {
	const baseStyle = 'px-4 py-2 rounded-lg border';
	const variantStyle = variant === 'primary' ? 'bg-cyan-500 text-grey-900' : 'bg-red-500 text-grey-900';
	const disabledStyle = 'opacity-50 cursor-not-allowed'
	return (
			<button
					type='button'
					onClick={onClick}
					disabled={disabled}
					className={`${baseStyle} ${variantStyle} ${disabled ? disabledStyle : ''}`}				
			>
					{label}
			</button>
	)
};

export default CustomButton;