/* eslint-disable react/prop-types */

const Button = ({ buttonInfo }) => {
    const { buttonType = "button", buttonText, buttonStyle } = buttonInfo;
    return (
        <div>
            <button type={buttonType} className={buttonStyle}>{buttonText}</button>
        </div>
    );
}

export default Button;
