"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-default'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { submitMentorVerification } from './action'
import LogoutButton from '../LogoutButton'

const MentorVerificationForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    education: [''],
    workExperience: [''],
    areasOfExpertise: [''],
    linkedinUrl: '',
    resumeUrl: '',
    additionalNotes: ''
  });

  const [status, setStatus] = useState('pending'); // For demo: 'pending', 'verified', 'rejected'

  const addField = (field: 'education' | 'workExperience' | 'areasOfExpertise') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateField = (field: 'education' | 'workExperience' | 'areasOfExpertise', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeField = (field: 'education' | 'workExperience' | 'areasOfExpertise', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  /*
  TO: DO
    Implement a function to render a status banner based on the verification status
  */
  const renderStatusBanner = () => {
    switch(status) {
      case 'pending':
        return (
          <Alert className="mb-4 bg-yellow-50">
            <Clock className="h-4 w-4" />
            <AlertTitle>Verification Pending</AlertTitle>
            <AlertDescription>
              Your application is being reviewed. We&apos;ll notify you once it&apos;s processed.
            </AlertDescription>
          </Alert>
        );
      case 'verified':
        return (
          <Alert className="mb-4 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Verification Approved</AlertTitle>
            <AlertDescription>
              Congratulations! You&apos;re now a verified mentor.
            </AlertDescription>
          </Alert>
        );
      case 'rejected':
        return (
          <Alert className="mb-4 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Rejected</AlertTitle>
            <AlertDescription>
              Unfortunately, your application wasn&apos;t approved. Please review the feedback below.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Transform the form data to match the expected format
      const submissionData = {
        education: formData.education.filter(edu => edu.trim() !== '').join('; '),
        workExperience: formData.workExperience.filter(exp => exp.trim() !== '').join('; '),
        areasOfExpertise: formData.areasOfExpertise.filter(area => area.trim() !== ''),
        linkedinUrl: formData.linkedinUrl,
        resumeUrl: formData.resumeUrl,
        additionalNotes: formData.additionalNotes
      };

      await submitMentorVerification(submissionData);
      setStatus('pending');
    } catch (err) {
      setError('Failed to submit verification request. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mentor Verification</CardTitle>
        <CardDescription>
          Please provide your credentials to become a verified mentor
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStatusBanner()}
        
        <div className="space-y-6">
          {/* Education Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={edu}
                  onChange={(e) => updateField('education', index, e.target.value)}
                  placeholder="Degree, Institution, Year"
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    onClick={() => removeField('education', index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() => addField('education')}
              variant="outline"
              size="sm"
            >
              Add Education
            </Button>
          </div>

          {/* Work Experience Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Work Experience</h3>
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={exp}
                  onChange={(e) => updateField('workExperience', index, e.target.value)}
                  placeholder="Position, Company, Duration"
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    onClick={() => removeField('workExperience', index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() => addField('workExperience')}
              variant="outline"
              size="sm"
            >
              Add Experience
            </Button>
          </div>

          {/* Areas of Expertise */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Areas of Expertise</h3>
            {formData.areasOfExpertise.map((area, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={area}
                  onChange={(e) => updateField('areasOfExpertise', index, e.target.value)}
                  placeholder="E.g., Web Development, Machine Learning"
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    onClick={() => removeField('areasOfExpertise', index)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() => addField('areasOfExpertise')}
              variant="outline"
              size="sm"
            >
              Add Expertise
            </Button>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">LinkedIn Profile</h3>
            <Input
              value={formData.linkedinUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          {/* Resume URL */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Resume</h3>
            <Input
              value={formData.resumeUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
              placeholder="Upload your resume or provide a link"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Additional Notes</h3>
            <Textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Any additional information you'd like to share"
              rows={4}
            />
          </div>

            <Button 
                className="w-full" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Verification Request'}
            </Button>
            <LogoutButton />
            {error && (
                <div className="text-red-500 text-sm mb-4">
                {error}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorVerificationForm;