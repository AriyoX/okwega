import * as React from 'react';
import { VerificationResultProps } from '../types';

export const VerificationResult: React.FC<VerificationResultProps> = ({
  status,
  reviewerNotes,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif' }}>
    <h1>Mentor Verification Update</h1>
    <p>Your mentor verification request has been <strong>{status}</strong>.</p>
    {reviewerNotes && (
      <div>
        <h2>Reviewer Notes:</h2>
        <p>{reviewerNotes}</p>
      </div>
    )}
    <hr />
    <footer>
      <small>This is an automated message from Okwega.</small>
    </footer>
  </div>
);