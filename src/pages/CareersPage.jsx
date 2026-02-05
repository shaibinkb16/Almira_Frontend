import { useState } from 'react';
import { Briefcase, MapPin, Clock, Users, Heart, TrendingUp, Coffee, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/config/constants';

const JOB_OPENINGS = [
  {
    id: 1,
    title: 'Senior Jewelry Designer',
    department: 'Design',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '5+ years',
    description: 'Lead our design team in creating innovative and beautiful jewelry collections. Experience in traditional and contemporary designs required.',
    responsibilities: [
      'Create original jewelry designs and CAD drawings',
      'Lead design team and mentor junior designers',
      'Research market trends and customer preferences',
      'Collaborate with production team for feasibility',
    ],
  },
  {
    id: 2,
    title: 'E-commerce Manager',
    department: 'Digital Marketing',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Manage our online store, optimize conversion rates, and drive digital growth. Strong background in e-commerce and digital marketing required.',
    responsibilities: [
      'Manage website performance and user experience',
      'Develop and execute digital marketing campaigns',
      'Analyze data and optimize conversion funnels',
      'Coordinate with design and tech teams',
    ],
  },
  {
    id: 3,
    title: 'Customer Support Specialist',
    department: 'Customer Service',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '1-2 years',
    description: 'Provide exceptional customer service and support across multiple channels. Excellent communication skills and problem-solving ability required.',
    responsibilities: [
      'Respond to customer inquiries via phone, email, chat',
      'Resolve customer issues and complaints',
      'Process returns, exchanges, and refunds',
      'Maintain customer satisfaction and loyalty',
    ],
  },
  {
    id: 4,
    title: 'Full Stack Developer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Build and maintain our e-commerce platform. Experience with React, Node.js, and database systems required.',
    responsibilities: [
      'Develop and maintain web applications',
      'Optimize application performance and scalability',
      'Integrate third-party APIs and services',
      'Collaborate with design and product teams',
    ],
  },
  {
    id: 5,
    title: 'Social Media Manager',
    department: 'Marketing',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'Manage our social media presence and create engaging content. Strong understanding of Instagram, Facebook, and emerging platforms required.',
    responsibilities: [
      'Develop and execute social media strategy',
      'Create engaging content and campaigns',
      'Monitor and respond to community engagement',
      'Analyze metrics and optimize performance',
    ],
  },
  {
    id: 6,
    title: 'Quality Control Inspector',
    department: 'Operations',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: '2-3 years',
    description: 'Ensure all products meet our quality standards. Experience in jewelry inspection and gemology preferred.',
    responsibilities: [
      'Inspect jewelry pieces for quality and authenticity',
      'Verify gemstone certifications and hallmarking',
      'Document and report quality issues',
      'Work with suppliers to maintain standards',
    ],
  },
];

const BENEFITS = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance for you and your family',
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    description: 'Regular training, mentorship, and career advancement',
  },
  {
    icon: Coffee,
    title: 'Work-Life Balance',
    description: 'Flexible hours, remote work options, and generous leave',
  },
  {
    icon: Award,
    title: 'Performance Bonuses',
    description: 'Competitive salary with quarterly performance incentives',
  },
  {
    icon: Users,
    title: 'Team Culture',
    description: 'Collaborative environment with regular team events',
  },
  {
    icon: Briefcase,
    title: 'Employee Discounts',
    description: '40% off on all products for employees and family',
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Build your career with {APP_NAME} and help us craft beautiful experiences for our customers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-12">
        {/* Why Work With Us */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work at {APP_NAME}?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're more than just a jewelry company. We're a family of passionate individuals committed
            to excellence, innovation, and making a positive impact.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Job Openings */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Current Openings</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job List */}
            <div className="lg:col-span-1 space-y-4">
              {JOB_OPENINGS.map((job) => (
                <Card
                  key={job.id}
                  className={`p-5 cursor-pointer transition-all hover:shadow-md ${
                    selectedJob?.id === job.id ? 'border-2 border-amber-500 bg-amber-50' : ''
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="default" size="sm">
                      {job.type}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {job.experience}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <Card className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedJob.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{selectedJob.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedJob.type}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-6">
                      <Badge variant="default">{selectedJob.type}</Badge>
                      <Badge variant="outline">Experience: {selectedJob.experience}</Badge>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                      <p className="text-gray-700">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                      <ul className="space-y-2">
                        {selectedJob.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-amber-600 font-bold mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t">
                      <Button
                        size="lg"
                        onClick={() => window.location.href = 'mailto:careers@almira.com?subject=Application for ' + selectedJob.title}
                      >
                        Apply for this Position
                      </Button>
                      <p className="text-sm text-gray-500 mt-3">
                        Send your resume and cover letter to careers@almira.com with the position
                        title in the subject line.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Position</h3>
                  <p className="text-gray-600">
                    Click on any job opening from the list to view details and apply.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Don't See a Fit? */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Don't See the Right Position?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and
            we'll keep you in mind for future opportunities.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = 'mailto:careers@almira.com'}
          >
            Send Your Resume
          </Button>
        </Card>

        {/* Our Culture */}
        <Card className="p-8 md:p-12 mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                We encourage creative thinking and new ideas. Your voice matters here.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600 text-sm">
                We work together as a team, supporting each other to achieve common goals.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600 text-sm">
                We invest in your professional development with training and mentorship.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
