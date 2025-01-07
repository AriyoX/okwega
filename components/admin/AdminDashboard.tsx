"use client"

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-default';
import Button from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink } from 'lucide-react';
import LogoutButton from '@/app/dashboard/LogoutButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  email: string;
  id: string;
}

interface ProcessedVerification {
  id: string;
  submitted_at: string;
  status: 'pending' | 'verified' | 'rejected';
  education: string[];
  work_experience: string[];
  areas_of_expertise: string[];
  linkedin_url: string | null;
  resume_url: string | null;
  additional_notes: string | null;
  user_id: string;
  user: User;
}

interface Props {
  verifications: ProcessedVerification[];
}

const AdminDashboard = ({ verifications: initialVerifications }: Props) => {
  const [verifications, setVerifications] = useState<ProcessedVerification[]>(initialVerifications);
  const [selectedVerification, setSelectedVerification] = useState<ProcessedVerification | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();

  const handleVerificationAction = async (verificationId: string, action: 'verified' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsLoading(true);
    try {
      const timestamp = new Date().toISOString();

      // Update verification record
      const { error: verificationError } = await supabase
        .from('mentor_verifications')
        .update({
          status: action,
          reviewer_notes: reviewNotes,
          reviewed_at: timestamp
        })
        .eq('id', verificationId);
  
      if (verificationError) throw verificationError;
  
      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          verification_status: action,
          verification_reviewed_at: timestamp,
          verification_reviewer_notes: reviewNotes
        })
        .eq('id', selectedVerification.user_id);
  
      if (profileError) throw profileError;
  
      // Update local state
      setVerifications(verifications.map(v => 
        v.id === verificationId 
          ? { ...v, status: action }
          : v
      ));
      
      setSelectedVerification(null);
      setReviewNotes('');
    } catch (err) {
      console.error('Error updating verification:', err);
      setError(err instanceof Error ? err.message : 'An error occurred updating verification');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: 'pending' | 'verified' | 'rejected') => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mentor Verification Requests</CardTitle>
          <LogoutButton />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell className="font-medium">
                    {verification.user.email}
                  </TableCell>
                  <TableCell>
                    {new Date(verification.submitted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(verification.status)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVerification(verification)}
                      disabled={isLoading}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedVerification && (
        <Card>
          <CardHeader>
            <CardTitle>Review Application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {selectedVerification.user.email}
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(selectedVerification.submitted_at).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedVerification.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Work Experience</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedVerification.work_experience.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVerification.areas_of_expertise.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedVerification.additional_notes && (
                <div>
                  <h4 className="font-medium mb-2">Additional Notes</h4>
                  <p>{selectedVerification.additional_notes}</p>
                </div>
              )}

              <div className="space-y-2">
                {selectedVerification.linkedin_url && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={selectedVerification.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {selectedVerification.resume_url && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={selectedVerification.resume_url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      Resume
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-medium">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add your review notes here..."
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={() => handleVerificationAction(selectedVerification.id, 'verified')}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleVerificationAction(selectedVerification.id, 'rejected')}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;