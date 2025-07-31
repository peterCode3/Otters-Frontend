'use client';

import React from 'react';
import {
  faRobot,
  faArrowTrendUp,
  faArrowTrendDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WeeklySummary = ({
  summaryText = [
    'This week, 12 of 15 leads were high intent. Your average IQ score increased by 4.3%. Great consistency in lead quality with Meta continuing to be your strongest channel.',
    'Consider focusing more resources on LinkedIn, which showed a 12% improvement in lead quality compared to last month.',
  ],
  highlights = [
    { text: 'Lead volume up 8% week-over-week', type: 'up' },
    { text: 'Conversion rate improved by 2.1%', type: 'up' },
    { text: 'Website leads down 5% (seasonal trend)', type: 'down' },
  ],
}) => {
  const getIconData = (type) => {
    return type === 'up'
      ? { icon: faArrowTrendUp, color: 'var(--color-success)' }
      : { icon: faArrowTrendDown, color: 'var(--color-danger)' };
  };

  return (
    <div
      id="weekly-summary"
      className="rounded-xl p-6 shadow-soft"
      style={{ background: 'var(--color-white)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
          Weekly Summary
        </h2>
        <div className="flex items-center text-xs" style={{ color: 'var(--color-primary)' }}>
          <FontAwesomeIcon icon={faRobot} className="mr-1" />
          <span>AI-Generated</span>
        </div>
      </div>

      <div
        className="p-4 rounded-lg mb-4"
        style={{ background: 'var(--client-card-metric-bg)' }}
      >
        {summaryText.map((text, idx) => (
          <p
            key={idx}
            className={`text-sm leading-relaxed ${idx > 0 ? 'mt-3' : ''}`}
            style={{ color: 'var(--color-text)' }}
          >
            {text}
          </p>
        ))}
      </div>

      <div className="border-t pt-4" style={{ borderColor: 'var(--table-border)' }}>
        <h3
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--color-secondary)' }}
        >
          Key Highlights
        </h3>
        <ul className="space-y-2">
          {highlights.map((item, index) => {
            const { icon, color } = getIconData(item.type);
            return (
              <li key={index} className="flex items-center text-sm" style={{ color: 'var(--color-text)' }}>
                <FontAwesomeIcon icon={icon} className="mr-2" style={{ color }} />
                <span>{item.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default WeeklySummary;
