'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faScaleBalanced,
  faTemperatureHalf,
  faHeadset,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faSlack } from '@fortawesome/free-brands-svg-icons';

const HelpPanel = () => {
  return (
    <div
      id="help-panel"
      className="rounded-xl p-6 shadow-soft col-span-3"
      style={{
        background: 'var(--color-white)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
          Understanding Your Leads
        </h2>
        <button className="text-sm" style={{ color: 'var(--color-primary)' }}>
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-1" />
          Get Help
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* IQ Score Section */}
        <div
          className="p-4 rounded-lg"
          style={{ background: 'var(--card-bg)' }}
        >
          <h3 className="font-medium mb-2 flex items-center" style={{ color: 'var(--card-title)' }}>
            <FontAwesomeIcon icon={faScaleBalanced} className="mr-2" style={{ color: 'var(--color-primary)' }} />
            What does my IQ score mean?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
            The OTTERS IQ™ score rates leads from 1-10 based on intent, fit, and engagement signals.
          </p>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>8-10:</span>
              <span style={{ color: 'var(--color-success)' }} className="font-medium">
                Excellent fit
              </span>
            </div>
            <div className="flex justify-between">
              <span>6-7:</span>
              <span style={{ color: 'var(--color-warning)' }} className="font-medium">
                Good fit
              </span>
            </div>
            <div className="flex justify-between">
              <span>1-5:</span>
              <span style={{ color: 'var(--color-danger)' }} className="font-medium">
                Poor fit
              </span>
            </div>
          </div>
        </div>

        {/* Lead Temperature Section */}
        <div
          className="p-4 rounded-lg"
          style={{ background: 'var(--card-bg)' }}
        >
          <h3 className="font-medium mb-2 flex items-center" style={{ color: 'var(--card-title)' }}>
            <FontAwesomeIcon icon={faTemperatureHalf} className="mr-2" style={{ color: 'var(--color-primary)' }} />
            Lead Temperature Guide
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
            Lead temperature indicates readiness to engage and likelihood of conversion.
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--color-success)' }}></div>
              <span className="font-medium" style={{ color: 'var(--color-success)' }}>Hot:</span>
              <span className="ml-1">Ready to convert</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--color-warning)' }}></div>
              <span className="font-medium" style={{ color: 'var(--color-warning)' }}>Warm:</span>
              <span className="ml-1">Needs nurturing</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--color-danger)' }}></div>
              <span className="font-medium" style={{ color: 'var(--color-danger)' }}>Cold:</span>
              <span className="ml-1">Low conversion potential</span>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div
          className="p-4 rounded-lg"
          style={{ background: 'var(--card-bg)' }}
        >
          <h3 className="font-medium mb-2 flex items-center" style={{ color: 'var(--card-title)' }}>
            <FontAwesomeIcon icon={faHeadset} className="mr-2" style={{ color: 'var(--color-primary)' }} />
            Need Support?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
            Our team is here to help you get the most out of your lead data.
          </p>
          <div className="mt-4 space-y-3">
            <button
              className="w-full text-sm py-2 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--dashboard-header-btn-text)',
              }}
            >
              <FontAwesomeIcon icon={faSlack} className="mr-2" />
              Contact via Slack
            </button>
            <button
              className="w-full border text-sm py-2 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-white)',
                borderColor: 'var(--client-card-border)',
                color: 'var(--color-secondary)',
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPanel;
