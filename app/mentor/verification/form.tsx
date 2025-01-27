"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-default';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { submitMentorVerification } from './action';
import LogoutButton from '../dashboard/LogoutButton';
import { useRouter } from 'next/navigation';

interface MentorVerificationFormProps {
  initialStatus?: string;
  reviewerNotes?: string;
}

const MentorVerificationForm = ({ 
  initialStatus = '', 
  reviewerNotes = '' 
}: MentorVerificationFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(!initialStatus);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [formData, setFormData] = useState({
    education: [''],
    workExperience: [''],
    areasOfExpertise: [''],
    linkedinUrl: '',
    resumeUrl: '',
    additionalNotes: ''
  });

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

  const renderStatusBanner = () => {
    if (!currentStatus) {
      return null;
    }

    switch(currentStatus) {
      case 'pending':
        return (
          <div>
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Verification Pending</AlertTitle>
            <AlertDescription>
              Your application is being reviewed. We&apos;ll notify you once it&apos;s processed.
            </AlertDescription>
          </Alert><LogoutButton />
          </div>
        );
        
      case 'rejected':
        return (
          <div className="space-y-4 mb-6">
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Verification Rejected</AlertTitle>
              <AlertDescription>
                Unfortunately, your previous application wasn&apos;t approved.
                {reviewerNotes && (
                  <div className="mt-2">
                    <strong>Reviewer feedback:</strong>
                    <p className="mt-1">{reviewerNotes}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
            {!showForm && (
              <div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full mb-2"
                >
                  Submit New Verification Request
                </Button>
                <LogoutButton />
              </div>
            )}
          </div>
        );
        
      case 'verified':
        return (
          <div className="space-y-4 mb-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Verification Approved</AlertTitle>
              <AlertDescription>
                Congratulations! You&apos;re now a verified mentor.
              </AlertDescription>
            </Alert>
            <Button className="w-full">
              <Link href="/mentor/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <LogoutButton />
          </div>
        );
        
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const submissionData = {
        education: formData.education.filter(edu => edu.trim() !== '').join('; '),
        workExperience: formData.workExperience.filter(exp => exp.trim() !== '').join('; '),
        areasOfExpertise: formData.areasOfExpertise.filter(area => area.trim() !== ''),
        linkedinUrl: formData.linkedinUrl,
        resumeUrl: formData.resumeUrl,
        additionalNotes: formData.additionalNotes
      };

      await submitMentorVerification(submissionData);
      setCurrentStatus('pending');
      setShowForm(false);
      router.refresh()
    } catch (err) {
      setError('Failed to submit verification request. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowForm = !currentStatus || (currentStatus === 'rejected' && showForm);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mentor Verification</CardTitle>
        <CardDescription>
          {currentStatus === 'rejected' 
            ? 'Submit a new verification request with updated information'
            : 'Please provide your credentials to become a verified mentor'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStatusBanner()}
        {shouldShowForm && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default MentorVerificationForm;