import PropTypes from 'prop-types'

const Heading = ({ level, children, className, style }) => {

    const HeadingTag = `h${level}`

    const getHeadingStyles = (level) => {
        switch (level) {
          case '1':
            return 'text-5xl';
          case '2':
            return 'text-4xl';
          case '3':
            return 'text-3xl';
          case '4':
            return 'text-2xl';
          case '5':
            return 'text-xl';
          case '6':
            return 'text-lg';
          default:
            return 'text-lg';
        }
    }

    const headingStyles = getHeadingStyles(level)

  return (
    <HeadingTag className={`${headingStyles} ${className}`} style={style}>{children}</HeadingTag>
  )
}

Heading.propTypes = {
    level: PropTypes.oneOf(['1', '2', '3', '4', '5', '6']).isRequired,
}

export default Heading