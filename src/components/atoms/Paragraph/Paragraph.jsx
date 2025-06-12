import PropTypes from 'prop-types';

const Paragraph = ({children, className})=>{
    const Pragraphstyle = "text-sceondary";
    return(
        <p className={`${Pragraphstyle} ${className}`}>{children}</p>
    );
};

Paragraph.proptypes = {
    children:PropTypes.string.isRequired
}

export default Paragraph;

