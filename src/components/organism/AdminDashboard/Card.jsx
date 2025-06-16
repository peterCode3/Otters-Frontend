import React from 'react';
import PropTypes from 'prop-types';
import Heading from '../../atoms/Heading/Heading';
import Paragraph from '../../atoms/Paragraph/Paragraph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = ({
  icon,
  iconClass,
  title,
  value,
  valueClass,
  trendIcon,
  trend,
  trendClass,
  progress,
}) => (
  <div
    className="rounded-xl p-6 shadow-soft"
    style={{
      background: 'var(--card-bg)',
      color: 'var(--card-title)',
    }}
  >
    <div className="flex justify-between items-center mb-2">
      <Heading
        level="6"
        className="text-sm font-medium"
        style={{ color: 'var(--color-secondary)' }}
      >
        {title}
      </Heading>
      <div style={{ color: 'var(--card-value)' }}>
        <FontAwesomeIcon icon={icon} className={iconClass || 'text-xl'} />
      </div>
    </div>
    <div className="flex items-end">
      <Paragraph className={`text-3xl font-bold ${valueClass}`} style={{ color: 'var(--card-value)' }}>
        {value}
      </Paragraph>
      {trend !== undefined && (
        <Paragraph className={`text-xs ml-2 mb-1 flex items-center ${trendClass}`}>
          {trendIcon && <FontAwesomeIcon icon={trendIcon} className="mr-1" />}
          {trend}
        </Paragraph>
      )}
    </div>
    {progress !== undefined && (
      <div className="mt-2">
        <div
          className="w-full rounded-full h-1"
          style={{ background: 'var(--color-secondary)', opacity: 0.2 }}
        >
          <div
            className="h-1 rounded-full"
            style={{
              background: 'var(--color-primary)',
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>
    )}
  </div>
);

Card.propTypes = {
  icon: PropTypes.object.isRequired,
  iconClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  valueClass: PropTypes.string,
  trendIcon: PropTypes.object,
  trend: PropTypes.string,
  trendClass: PropTypes.string,
  progress: PropTypes.number,
};

export default Card;